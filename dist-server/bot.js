import { Telegraf, Markup } from 'telegraf';
import { getProducts, addProduct, toggleProductStock, deleteProduct } from './db.js';
import { IPHONE_MODELS, SERIES_LIST } from './iphoneSpecs.js';
export const createTelegramBot = (token) => {
    const bot = new Telegraf(token);
    const sessions = new Map();
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };
    const finalizeProduct = (chatId, session) => {
        const images = session.data.images && session.data.images.length > 0
            ? session.data.images
            : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'];
        const finalProduct = addProduct({
            name: session.data.name || 'iPhone Unit',
            series: session.data.series || '15',
            conditionType: session.data.conditionType || 'second',
            storage: session.data.storage || '128 GB',
            color: session.data.color || 'Black',
            price: session.data.price || 10000000,
            originalPrice: (session.data.price || 10000000) + 1500000,
            bh: session.data.bh || '90%',
            statusText: 'Ready Stock',
            isReady: true,
            image: images[0],
            images: images,
            gradeBadge: session.data.conditionType === 'bnib' ? 'BNIB Segel Resmi' : 'Grade A+ Like New',
            desc: session.data.desc || `${session.data.color} • ${session.data.warranty} • Siap pakai`,
            minus: session.data.minus || undefined,
            warranty: session.data.warranty || 'Resmi iBox Indonesia',
            completeness: session.data.completeness || 'Fullset Box Dus Buku + Kabel',
            storeGaransi: '',
            imei: session.data.warranty || 'Resmi iBox Indonesia',
        });
        sessions.delete(chatId);
        const successText = `🎉 *STOK BERHASIL DITAMBAHKAN KE WEBSITE!*\n\n` +
            `📱 *Model:* ${finalProduct.name}\n` +
            `💾 *Storage:* ${finalProduct.storage} | 🎨 *Warna:* ${finalProduct.color}\n` +
            `🔋 *BH:* ${finalProduct.bh} | 🛡️ *Garansi:* ${finalProduct.warranty}\n` +
            `📦 *Kelengkapan:* ${finalProduct.completeness}\n` +
            `💰 *Harga:* ${formatRupiah(finalProduct.price)}\n` +
            `🖼️ *Total Foto:* ${finalProduct.images?.length || 1} foto terupload\n` +
            (finalProduct.minus ? `📋 *Detail:* ${finalProduct.minus}\n` : '') +
            `📝 *Deskripsi:* ${finalProduct.desc}\n` +
            `🟢 *Status:* Ready Stock di Website\n\n` +
            `_Produk sudah langsung live dan detailnya bisa dilihat pembeli di katalog website!_`;
        bot.telegram.sendMessage(chatId, successText, { parse_mode: 'Markdown' });
    };
    // /start & /help
    bot.command(['start', 'help'], async (ctx) => {
        const text = `👋 *Halo Admin Kedai Gadget!*\n\n` +
            `Bot ini siap membantu mengelola stok website Anda secara instan dan simpel tanpa banyak mengetik.\n\n` +
            `📌 *Daftar Perintah:*\n` +
            `• /add - Tambah stok iPhone baru (pilih seri, model, internal tinggal klik tombol)\n` +
            `• /list - Lihat daftar semua stok aktif\n` +
            `• /stok - Cek dan ubah status Ready/Habis unit\n` +
            `• /hapus - Hapus stok iPhone dari katalog\n` +
            `• /batal - Batalkan proses input yang sedang berjalan`;
        await ctx.replyWithMarkdown(text);
    });
    // /batal
    bot.command('batal', async (ctx) => {
        const chatId = ctx.chat.id;
        if (sessions.has(chatId)) {
            sessions.delete(chatId);
            await ctx.reply('❌ Proses penambahan produk telah dibatalkan.');
        }
        else {
            await ctx.reply('Tidak ada proses input yang sedang berjalan.');
        }
    });
    // /add command - Starts with Series Selection
    bot.command('add', async (ctx) => {
        const chatId = ctx.chat.id;
        sessions.set(chatId, { step: 1, data: { images: [] } });
        const seriesButtons = [
            [
                Markup.button.callback('iPhone 17 Series', 'selseries_17'),
                Markup.button.callback('iPhone 16 Series', 'selseries_16'),
            ],
            [
                Markup.button.callback('iPhone 15 Series', 'selseries_15'),
                Markup.button.callback('iPhone 14 Series', 'selseries_14'),
            ],
            [
                Markup.button.callback('iPhone 13 Series', 'selseries_13'),
                Markup.button.callback('iPhone 12 Series', 'selseries_12'),
            ],
            [
                Markup.button.callback('iPhone 11 Series', 'selseries_11'),
                Markup.button.callback('iPhone X / XS / XR', 'selseries_X'),
            ],
            [
                Markup.button.callback('iPhone SE Series', 'selseries_SE'),
                Markup.button.callback('iPhone 8 / 8 Plus', 'selseries_8'),
            ],
        ];
        await ctx.replyWithMarkdown(`📱 *[Langkah 1/9]* Pilih *Seri iPhone*:`, Markup.inlineKeyboard(seriesButtons));
    });
    // /list command
    bot.command('list', async (ctx) => {
        const products = getProducts();
        if (products.length === 0) {
            return ctx.reply('Belum ada produk di katalog.');
        }
        let response = `📋 *DAFTAR STOK KEDAI GADGET* (${products.length} Unit):\n\n`;
        products.forEach((p, idx) => {
            const statusIcon = p.isReady ? '🟢' : '🔴';
            const imgCount = p.images?.length || 1;
            response += `${idx + 1}. ${statusIcon} *${p.name}* (${p.storage})\n`;
            response += `   🎨 ${p.color} | BH: ${p.bh} | 💰 ${formatRupiah(p.price)} | 🖼️ ${imgCount} foto\n`;
            response += `   🛡️ ${p.warranty}\n`;
            if (p.minus)
                response += `   📋 Detail: ${p.minus}\n`;
            response += `   🆔 ID: \`${p.id}\`\n\n`;
        });
        response += `_Gunakan /stok untuk toggle Ready/Habis atau /hapus untuk menghapus unit._`;
        await ctx.replyWithMarkdown(response);
    });
    // /stok command
    bot.command('stok', async (ctx) => {
        const products = getProducts();
        if (products.length === 0) {
            return ctx.reply('Belum ada produk di katalog.');
        }
        const buttons = products.slice(0, 15).map((p) => [
            Markup.button.callback(`${p.isReady ? '🟢 Ready' : '🔴 Habis'} | ${p.name} ${p.storage} (${p.color})`, `toggle_${p.id}`),
        ]);
        await ctx.replyWithMarkdown('🔄 *Pilih unit untuk mengubah status ketersediaan:*', Markup.inlineKeyboard(buttons));
    });
    // /hapus command
    bot.command('hapus', async (ctx) => {
        const products = getProducts();
        if (products.length === 0) {
            return ctx.reply('Belum ada produk di katalog.');
        }
        const buttons = products.slice(0, 15).map((p) => [
            Markup.button.callback(`🗑️ Hapus ${p.name} ${p.storage} (${p.color})`, `delete_${p.id}`),
        ]);
        await ctx.replyWithMarkdown('⚠️ *Pilih unit yang ingin dihapus permanen dari website:*', Markup.inlineKeyboard(buttons));
    });
    // Callback query handlers
    bot.on('callback_query', async (ctx) => {
        const callbackData = ctx.callbackQuery?.data;
        const chatId = ctx.chat?.id;
        if (!callbackData || !chatId)
            return;
        // Finish upload button
        if (callbackData === 'finish_upload') {
            const session = sessions.get(chatId);
            if (session && session.step === 9) {
                await ctx.answerCbQuery('Menyimpan produk...');
                finalizeProduct(chatId, session);
            }
            return;
        }
        // Toggle stock
        if (callbackData.startsWith('toggle_')) {
            const id = callbackData.replace('toggle_', '');
            const updated = toggleProductStock(id);
            if (updated) {
                await ctx.answerCbQuery(`Status ${updated.name} diubah menjadi: ${updated.statusText}`);
                await ctx.replyWithMarkdown(`✅ Status unit *${updated.name}* berhasil diubah menjadi: *${updated.statusText}*`);
            }
            return;
        }
        // Delete product
        if (callbackData.startsWith('delete_')) {
            const id = callbackData.replace('delete_', '');
            const success = deleteProduct(id);
            if (success) {
                await ctx.answerCbQuery('Produk berhasil dihapus!');
                await ctx.reply('🗑️ Produk berhasil dihapus dari website.');
            }
            return;
        }
        const session = sessions.get(chatId);
        if (!session)
            return;
        // Step 1 -> Select Series: Gives Model Buttons!
        if (callbackData.startsWith('selseries_')) {
            const seriesId = callbackData.replace('selseries_', '');
            const seriesObj = SERIES_LIST.find((s) => s.id === seriesId);
            if (!seriesObj)
                return;
            session.data.series = seriesId;
            session.step = 2;
            await ctx.answerCbQuery();
            const modelButtons = seriesObj.models.map((modelKey) => {
                const model = IPHONE_MODELS[modelKey];
                return [Markup.button.callback(model.name, `selmodel_${modelKey}`)];
            });
            await ctx.replyWithMarkdown(`📲 *[Langkah 2/9]* Pilih *Tipe Model ${seriesObj.label}*:`, Markup.inlineKeyboard(modelButtons));
            return;
        }
        // Step 2 -> Select Model: Gives Storage Buttons corresponding to that exact model!
        if (callbackData.startsWith('selmodel_')) {
            const modelKey = callbackData.replace('selmodel_', '');
            const model = IPHONE_MODELS[modelKey];
            if (!model)
                return;
            session.data.modelKey = modelKey;
            session.data.name = model.name;
            session.step = 3;
            await ctx.answerCbQuery();
            // Dynamically display only available storages for this model
            const storageButtons = model.storages.map((stg) => [
                Markup.button.callback(stg, `selstorage_${stg}`),
            ]);
            await ctx.replyWithMarkdown(`💾 *[Langkah 3/9]* Pilih *Kapasitas Internal untuk ${model.name}*:\n_Hanya menampilkan varian penyimpanan resmi model ini_`, Markup.inlineKeyboard(storageButtons));
            return;
        }
        // Step 3 -> Select Storage: Gives Condition Buttons
        if (callbackData.startsWith('selstorage_')) {
            const stg = callbackData.replace('selstorage_', '');
            session.data.storage = stg;
            session.step = 4;
            await ctx.answerCbQuery();
            await ctx.replyWithMarkdown(`✨ *[Langkah 4/9]* Pilih *Kondisi Unit*:`, Markup.inlineKeyboard([
                [Markup.button.callback('Second Like New (Grade A+)', 'cond_second')],
                [Markup.button.callback('BNIB Segel Resmi', 'cond_bnib')],
            ]));
            return;
        }
        // Step 4 -> Select Condition: Gives Warranty/IMEI Buttons
        if (callbackData.startsWith('cond_')) {
            const conditionType = callbackData.replace('cond_', '');
            session.data.conditionType = conditionType;
            session.step = 5;
            await ctx.answerCbQuery();
            await ctx.replyWithMarkdown(`🛡️ *[Langkah 5/9]* Pilih *Status Garansi / Legalitas IMEI*:`, Markup.inlineKeyboard([
                [Markup.button.callback('Resmi IBOX', 'war_ibox')],
                [Markup.button.callback('Resmi Beacukai', 'war_beacukai')],
                [Markup.button.callback('Inter All Operator', 'war_interallop')],
            ]));
            return;
        }
        // Step 5 -> Select Warranty: Gives Battery Health Quick Selection
        if (callbackData.startsWith('war_')) {
            let warrantyText = 'Resmi IBOX';
            if (callbackData === 'war_ibox')
                warrantyText = 'Resmi IBOX';
            if (callbackData === 'war_beacukai')
                warrantyText = 'Resmi Beacukai';
            if (callbackData === 'war_interallop')
                warrantyText = 'Inter All Operator';
            session.data.warranty = warrantyText;
            session.step = 6;
            await ctx.answerCbQuery();
            // Quick battery buttons or typing
            await ctx.replyWithMarkdown(`🔋 *[Langkah 6/9]* Pilih atau Ketik *Battery Health (BH)*:\n\n_Klik tombol cepat atau ketik angka langsung (misal: \`92\`):_`, Markup.inlineKeyboard([
                [
                    Markup.button.callback('100% (New)', 'bh_100%'),
                    Markup.button.callback('99%', 'bh_99%'),
                    Markup.button.callback('98%', 'bh_98%'),
                ],
                [
                    Markup.button.callback('95%', 'bh_95%'),
                    Markup.button.callback('92%', 'bh_92%'),
                    Markup.button.callback('90%', 'bh_90%'),
                ],
                [
                    Markup.button.callback('88%', 'bh_88%'),
                    Markup.button.callback('86%', 'bh_86%'),
                    Markup.button.callback('85%', 'bh_85%'),
                ],
            ]));
            return;
        }
        // Quick BH selected
        if (callbackData.startsWith('bh_')) {
            const bhVal = callbackData.replace('bh_', '');
            session.data.bh = bhVal;
            session.step = 7;
            await ctx.answerCbQuery();
            await ctx.replyWithMarkdown(`🎨 *[Langkah 7/9]* Masukkan *Warna & Harga* unit ini:\n\nKetik dengan format: *Warna, Harga*\nContoh: \`Natural Titanium, 18500000\`\natau: \`Midnight, 8900000\``);
            return;
        }
        // Quick Detail: Mulus Button
        if (callbackData === 'desc_mulus') {
            session.data.desc = `${session.data.color} • ${session.data.warranty} • Mulus like new`;
            session.data.minus = undefined;
            session.step = 9;
            await ctx.answerCbQuery();
            await ctx.replyWithMarkdown(`📸 *[Langkah 9/9]* Kirimkan *Foto Produk* (Bisa upload 1 sampai 8+ foto sekaligus):\n\n` +
                `• Kirim foto langsung dari galeri atau kamera Telegram.\n` +
                `• Foto pertama akan menjadi foto sampul.\n` +
                `• Atau ketik \`default\` jika menggunakan foto standar.\n\n` +
                `Setelah selesai mengirim semua foto, klik tombol di bawah:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Selesai Upload Foto', 'finish_upload')],
            ]));
            return;
        }
    });
    // Text message handler for wizard
    bot.on('text', async (ctx) => {
        const chatId = ctx.chat.id;
        const text = ctx.message.text.trim();
        if (text.startsWith('/'))
            return;
        const session = sessions.get(chatId);
        if (!session)
            return;
        // Handle BH if typed manually instead of clicking button
        if (session.step === 6) {
            const cleanBh = text.includes('%') ? text : `${text}%`;
            session.data.bh = cleanBh;
            session.step = 7;
            await ctx.replyWithMarkdown(`🎨 *[Langkah 7/9]* Masukkan *Warna & Harga* unit ini:\n\nKetik dengan format: *Warna, Harga*\nContoh: \`Natural Titanium, 18500000\`\natau: \`Midnight, 8900000\``);
            return;
        }
        // Step 7: Color and Price in one go!
        if (session.step === 7) {
            let color = 'Black';
            let price = 10000000;
            if (text.includes(',')) {
                const parts = text.split(',');
                color = parts[0].trim();
                const priceNum = parseInt(parts[1].replace(/\D/g, ''), 10);
                if (!isNaN(priceNum) && priceNum > 0) {
                    price = priceNum;
                }
            }
            else {
                color = text;
            }
            session.data.color = color;
            session.data.price = price;
            session.step = 75; // Intermediary to get kelengkapan
            await ctx.replyWithMarkdown(`📦 *[Langkah 8/9]* Tuliskan *Kelengkapan Unit*:\n\nContoh: \`Fullset Box Original + Kabel C to C\` atau \`Unit Only (Batangan)\` atau \`Dus OEM + Adaptor\``);
            return;
        }
        // Step 75: Kelengkapan
        if (session.step === 75) {
            session.data.completeness = text;
            session.step = 76;
            await ctx.replyWithMarkdown(`📋 Apakah ada *Detail Kondisi / Catatan* pada unit ini?\n\n` +
                `• Klik tombol di bawah jika unit mulus normal tanpa minus\n` +
                `• Atau ketik langsung detailnya (contoh: \`ada lecet halus di sudut bawah bekas case, TrueTone & FaceID aman\`):`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Mulus Normal (Tanpa Minus)', 'desc_mulus')],
            ]));
            return;
        }
        // Step 76: User typed detail note
        if (session.step === 76) {
            const isMulus = text.toLowerCase() === 'mulus' || text.toLowerCase() === 'tidak ada' || text.toLowerCase() === '-';
            session.data.desc = text;
            if (!isMulus) {
                session.data.minus = text;
            }
            session.step = 9;
            await ctx.replyWithMarkdown(`📸 *[Langkah 9/9]* Kirimkan *Foto Produk* (Bisa upload 1 sampai 8+ foto sekaligus):\n\n` +
                `• Kirim foto langsung dari galeri atau kamera Telegram.\n` +
                `• Foto pertama akan menjadi foto sampul.\n` +
                `• Atau ketik link URL gambar.\n` +
                `• Atau ketik \`default\` jika menggunakan foto standar.\n\n` +
                `Setelah selesai mengirim semua foto, klik tombol di bawah:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Selesai Upload Foto', 'finish_upload')],
            ]));
            return;
        }
        // Step 9: Image URL or text fallback
        if (session.step === 9) {
            let imageUrl = text;
            if (text.toLowerCase() === 'default' || !text.startsWith('http')) {
                imageUrl = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80';
            }
            session.data.images.push(imageUrl);
            await ctx.replyWithMarkdown(`📥 Foto berhasil dicatat (${session.data.images.length} foto tersimpan).\nKirim foto lagi atau klik tombol di bawah jika sudah selesai:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Selesai Upload Foto', 'finish_upload')],
            ]));
            return;
        }
    });
    // Handle direct photo uploads for step 9 (Multiple photos supported)
    bot.on('photo', async (ctx) => {
        const chatId = ctx.chat.id;
        const session = sessions.get(chatId);
        if (session && session.step === 9) {
            const photos = ctx.message.photo;
            if (!photos || photos.length === 0)
                return;
            const largest = photos[photos.length - 1];
            const link = await ctx.telegram.getFileLink(largest.file_id);
            const photoUrl = link.href;
            session.data.images.push(photoUrl);
            const total = session.data.images.length;
            await ctx.replyWithMarkdown(`📸 *Foto ke-${total} diterima!* Kirim foto lainnya (hingga 8+ foto) atau klik tombol di bawah jika sudah selesai:`, Markup.inlineKeyboard([
                [Markup.button.callback(`✅ Selesai Upload (${total} Foto)`, 'finish_upload')],
            ]));
        }
    });
    bot.launch().then(() => {
        console.log('🤖 Telegram Bot launched successfully with Telegraf!');
    }).catch((err) => {
        console.error('Error launching Telegram Bot:', err);
    });
    return bot;
};

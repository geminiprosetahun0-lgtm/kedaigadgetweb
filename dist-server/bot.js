import { Telegraf, Markup } from 'telegraf';
import { getProducts, addProduct, toggleProductStock, deleteProduct, updateProduct } from './db.js';
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
            `• /add - Tambah stok iPhone baru (panduan langkah demi langkah)\n` +
            `• /edit - Edit postingan stok (tersedia 9 pilihan detail spesifikasi)\n` +
            `• /list - Lihat daftar semua stok aktif\n` +
            `• /stok - Cek dan ubah status Ready/Habis unit\n` +
            `• /hapus - Hapus stok iPhone dari katalog\n` +
            `• /batal - Batalkan proses input/edit yang sedang berjalan`;
        await ctx.replyWithMarkdown(text);
    });
    // /batal
    bot.command('batal', async (ctx) => {
        const chatId = ctx.chat.id;
        if (sessions.has(chatId)) {
            sessions.delete(chatId);
            await ctx.reply('❌ Proses penambahan / edit produk telah dibatalkan.');
        }
        else {
            await ctx.reply('Tidak ada proses input/edit yang sedang berjalan.');
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
    // /edit command
    bot.command('edit', async (ctx) => {
        const products = getProducts();
        if (products.length === 0) {
            return ctx.reply('Belum ada produk di katalog untuk diedit.');
        }
        const buttons = products.slice(0, 15).map((p) => [
            Markup.button.callback(`✏️ ${p.name} ${p.storage} (${p.color}) - ${formatRupiah(p.price)}`, `editselect_${p.id}`),
        ]);
        await ctx.replyWithMarkdown('📝 *Pilih postingan stok yang ingin diedit:*', Markup.inlineKeyboard(buttons));
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
            if (session && session.type !== 'edit' && session.step === 9) {
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
        // Select Product to Edit -> Show 9 Modification Options
        if (callbackData.startsWith('editselect_')) {
            const id = callbackData.replace('editselect_', '');
            const products = getProducts();
            const product = products.find((p) => p.id === id);
            if (!product) {
                await ctx.answerCbQuery('Produk tidak ditemukan!');
                return ctx.reply('❌ Produk tidak ditemukan.');
            }
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                data: {},
            });
            await ctx.answerCbQuery();
            const editMenuButtons = [
                [
                    Markup.button.callback('1. 📱 Seri & Tipe Model', `editopt_series_${id}`),
                    Markup.button.callback('2. 💾 Kapasitas Internal', `editopt_storage_${id}`),
                ],
                [
                    Markup.button.callback('3. ✨ Kondisi (Second/BNIB)', `editopt_condition_${id}`),
                    Markup.button.callback('4. 🛡️ Garansi / IMEI', `editopt_warranty_${id}`),
                ],
                [
                    Markup.button.callback('5. 🔋 Battery Health (BH)', `editopt_bh_${id}`),
                    Markup.button.callback('6. 🎨 Warna Unit', `editopt_color_${id}`),
                ],
                [
                    Markup.button.callback('7. 💰 Harga Jual', `editopt_price_${id}`),
                    Markup.button.callback('8. 📦 Kelengkapan Unit', `editopt_completeness_${id}`),
                ],
                [
                    Markup.button.callback('9. 📋 Detail / Catatan / Minus', `editopt_detail_${id}`),
                ],
                [
                    Markup.button.callback('📸 Ganti / Upload Ulang Foto', `editopt_photo_${id}`),
                ],
                [
                    Markup.button.callback('❌ Batal Edit', 'cancel_edit'),
                ],
            ];
            await ctx.replyWithMarkdown(`✏️ *EDIT POSTINGAN:* *${product.name}* (${product.storage})\n` +
                `• Warna: ${product.color} | BH: ${product.bh}\n` +
                `• Harga: ${formatRupiah(product.price)}\n` +
                `• Garansi: ${product.warranty}\n` +
                `• Kelengkapan: ${product.completeness}\n` +
                (product.minus ? `• Detail: ${product.minus}\n` : '') +
                `\n*Pilih bagian yang ingin Anda modifikasi:*`, Markup.inlineKeyboard(editMenuButtons));
            return;
        }
        if (callbackData === 'cancel_edit') {
            sessions.delete(chatId);
            await ctx.answerCbQuery('Edit dibatalkan');
            return ctx.reply('❌ Sesi edit produk dibatalkan.');
        }
        // 1. Edit Series & Model Option
        if (callbackData.startsWith('editopt_series_')) {
            const id = callbackData.replace('editopt_series_', '');
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'series_model',
                subStep: 1,
                data: {},
            });
            await ctx.answerCbQuery();
            const seriesButtons = [
                [
                    Markup.button.callback('iPhone 17 Series', 'editselseries_17'),
                    Markup.button.callback('iPhone 16 Series', 'editselseries_16'),
                ],
                [
                    Markup.button.callback('iPhone 15 Series', 'editselseries_15'),
                    Markup.button.callback('iPhone 14 Series', 'editselseries_14'),
                ],
                [
                    Markup.button.callback('iPhone 13 Series', 'editselseries_13'),
                    Markup.button.callback('iPhone 12 Series', 'editselseries_12'),
                ],
                [
                    Markup.button.callback('iPhone 11 Series', 'editselseries_11'),
                    Markup.button.callback('iPhone X / XS / XR', 'editselseries_X'),
                ],
                [
                    Markup.button.callback('iPhone SE Series', 'editselseries_SE'),
                    Markup.button.callback('iPhone 8 / 8 Plus', 'editselseries_8'),
                ],
            ];
            return ctx.replyWithMarkdown('📱 *[Edit 1/9]* Pilih *Seri iPhone Baru*:', Markup.inlineKeyboard(seriesButtons));
        }
        if (callbackData.startsWith('editselseries_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const seriesId = callbackData.replace('editselseries_', '');
            const seriesObj = SERIES_LIST.find((s) => s.id === seriesId);
            if (!seriesObj)
                return;
            sess.data.series = seriesId;
            sess.subStep = 2;
            await ctx.answerCbQuery();
            const modelButtons = seriesObj.models.map((modelKey) => {
                const model = IPHONE_MODELS[modelKey];
                return [Markup.button.callback(model.name, `editselmodel_${modelKey}`)];
            });
            return ctx.replyWithMarkdown(`📲 *[Edit 1/9]* Pilih *Tipe Model ${seriesObj.label}*:`, Markup.inlineKeyboard(modelButtons));
        }
        if (callbackData.startsWith('editselmodel_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const modelKey = callbackData.replace('editselmodel_', '');
            const model = IPHONE_MODELS[modelKey];
            if (!model)
                return;
            const updated = updateProduct(sess.productId, {
                name: model.name,
                series: sess.data.series || '15',
            });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Model berhasil diupdate!');
            return ctx.replyWithMarkdown(`✅ *Model & Seri berhasil diupdate:*\n*${updated?.name}* (Seri: ${updated?.series})`);
        }
        // 2. Edit Storage Option
        if (callbackData.startsWith('editopt_storage_')) {
            const id = callbackData.replace('editopt_storage_', '');
            const products = getProducts();
            const product = products.find((p) => p.id === id);
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'storage',
                data: {},
            });
            await ctx.answerCbQuery();
            const storages = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];
            const buttons = storages.map((stg) => [Markup.button.callback(stg, `editselstorage_${stg}`)]);
            return ctx.replyWithMarkdown(`💾 *[Edit 2/9]* Pilih *Kapasitas Internal Baru* untuk *${product?.name}*:\n_Saat ini: ${product?.storage}_`, Markup.inlineKeyboard(buttons));
        }
        if (callbackData.startsWith('editselstorage_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const stg = callbackData.replace('editselstorage_', '');
            const updated = updateProduct(sess.productId, { storage: stg });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Kapasitas berhasil diubah!');
            return ctx.replyWithMarkdown(`✅ *Kapasitas internal berhasil diupdate:*\n*${updated?.name}* -> *${updated?.storage}*`);
        }
        // 3. Edit Condition Option
        if (callbackData.startsWith('editopt_condition_')) {
            const id = callbackData.replace('editopt_condition_', '');
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'condition',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`✨ *[Edit 3/9]* Pilih *Kondisi Unit Baru*:`, Markup.inlineKeyboard([
                [Markup.button.callback('Second Like New (Grade A+)', 'editcond_second')],
                [Markup.button.callback('BNIB Segel Resmi', 'editcond_bnib')],
            ]));
        }
        if (callbackData.startsWith('editcond_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const cond = callbackData.replace('editcond_', '');
            const updated = updateProduct(sess.productId, {
                conditionType: cond,
                gradeBadge: cond === 'bnib' ? 'BNIB Segel Resmi' : 'Grade A+ Like New',
            });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Kondisi berhasil diubah!');
            return ctx.replyWithMarkdown(`✅ *Kondisi unit berhasil diupdate:*\n*${updated?.gradeBadge}*`);
        }
        // 4. Edit Warranty / IMEI Option
        if (callbackData.startsWith('editopt_warranty_')) {
            const id = callbackData.replace('editopt_warranty_', '');
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'warranty',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`🛡️ *[Edit 4/9]* Pilih *Status Garansi / Legalitas IMEI Baru*:`, Markup.inlineKeyboard([
                [Markup.button.callback('Resmi IBOX', 'editwar_ibox')],
                [Markup.button.callback('Resmi Beacukai', 'editwar_beacukai')],
                [Markup.button.callback('Inter All Operator', 'editwar_interallop')],
            ]));
        }
        if (callbackData.startsWith('editwar_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            let warrantyText = 'Resmi IBOX';
            if (callbackData === 'editwar_ibox')
                warrantyText = 'Resmi IBOX';
            if (callbackData === 'editwar_beacukai')
                warrantyText = 'Resmi Beacukai';
            if (callbackData === 'editwar_interallop')
                warrantyText = 'Inter All Operator';
            const updated = updateProduct(sess.productId, {
                warranty: warrantyText,
                imei: warrantyText,
            });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Garansi berhasil diubah!');
            return ctx.replyWithMarkdown(`✅ *Status garansi / IMEI berhasil diupdate:*\n*${updated?.warranty}*`);
        }
        // 5. Edit Battery Health Option
        if (callbackData.startsWith('editopt_bh_')) {
            const id = callbackData.replace('editopt_bh_', '');
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'bh',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`🔋 *[Edit 5/9]* Pilih atau Ketik *Battery Health (BH) Baru*:\n\n_Klik tombol cepat atau ketik angka langsung (misal: \`89\`):_`, Markup.inlineKeyboard([
                [
                    Markup.button.callback('100% (New)', 'editbh_100%'),
                    Markup.button.callback('99%', 'editbh_99%'),
                    Markup.button.callback('98%', 'editbh_98%'),
                ],
                [
                    Markup.button.callback('95%', 'editbh_95%'),
                    Markup.button.callback('92%', 'editbh_92%'),
                    Markup.button.callback('90%', 'editbh_90%'),
                ],
                [
                    Markup.button.callback('88%', 'editbh_88%'),
                    Markup.button.callback('86%', 'editbh_86%'),
                    Markup.button.callback('85%', 'editbh_85%'),
                ],
            ]));
        }
        if (callbackData.startsWith('editbh_')) {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const bhVal = callbackData.replace('editbh_', '');
            const updated = updateProduct(sess.productId, { bh: bhVal });
            sessions.delete(chatId);
            await ctx.answerCbQuery('BH berhasil diubah!');
            return ctx.replyWithMarkdown(`✅ *Battery Health berhasil diupdate:*\n*BH ${updated?.bh}*`);
        }
        // 6. Edit Color Option
        if (callbackData.startsWith('editopt_color_')) {
            const id = callbackData.replace('editopt_color_', '');
            const product = getProducts().find((p) => p.id === id);
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'color',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`🎨 *[Edit 6/9]* Ketik *Warna Baru* untuk *${product?.name}*:\n_Warna saat ini: ${product?.color}_\n\nContoh ketik: \`Natural Titanium\` atau \`Midnight\``);
        }
        // 7. Edit Price Option
        if (callbackData.startsWith('editopt_price_')) {
            const id = callbackData.replace('editopt_price_', '');
            const product = getProducts().find((p) => p.id === id);
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'price',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`💰 *[Edit 7/9]* Masukkan *Harga Jual Baru* untuk *${product?.name}*:\n_Harga saat ini: ${formatRupiah(product?.price || 0)}_\n\nKetik nominal angka langsung tanpa titik:\nContoh: \`17500000\``);
        }
        // 8. Edit Completeness Option
        if (callbackData.startsWith('editopt_completeness_')) {
            const id = callbackData.replace('editopt_completeness_', '');
            const product = getProducts().find((p) => p.id === id);
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'completeness',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`📦 *[Edit 8/9]* Tuliskan *Kelengkapan Unit Baru*:\n_Kelengkapan saat ini: ${product?.completeness}_\n\nContoh ketik: \`Fullset Box Dus Buku + Kabel OEM\` atau \`Unit Only (Batangan)\``);
        }
        // 9. Edit Detail / Catatan / Minus Option
        if (callbackData.startsWith('editopt_detail_')) {
            const id = callbackData.replace('editopt_detail_', '');
            const product = getProducts().find((p) => p.id === id);
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'detail',
                data: {},
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`📋 *[Edit 9/9]* Masukkan *Catatan / Detail / Minus Baru*:\n_Saat ini: ${product?.minus || product?.desc || 'Mulus'}\n\n` +
                `• Klik tombol di bawah jika unit mulus normal tanpa minus\n` +
                `• Atau ketik deskripsi detail unit yang baru:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Mulus Normal (Tanpa Minus)', 'editdesc_mulus')],
            ]));
        }
        if (callbackData === 'editdesc_mulus') {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const product = getProducts().find((p) => p.id === sess.productId);
            const updated = updateProduct(sess.productId, {
                desc: `${product?.color || 'Unit'} • ${product?.warranty || 'Resmi'} • Mulus like new`,
                minus: undefined,
            });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Detail berhasil diubah!');
            return ctx.replyWithMarkdown(`✅ *Detail & catatan unit berhasil diupdate:*\n*${updated?.desc}*`);
        }
        // Photo Edit Option
        if (callbackData.startsWith('editopt_photo_')) {
            const id = callbackData.replace('editopt_photo_', '');
            sessions.set(chatId, {
                type: 'edit',
                productId: id,
                field: 'photo',
                data: { images: [] },
            });
            await ctx.answerCbQuery();
            return ctx.replyWithMarkdown(`📸 *Ganti Foto Produk:*\n\n` +
                `• Kirim foto baru dari galeri/kamera (1 s/d 8+ foto).\n` +
                `• Foto pertama akan menjadi foto sampul.\n` +
                `• Foto lama akan digantikan dengan foto baru yang Anda kirim.\n\n` +
                `Klik tombol di bawah setelah selesai mengirim semua foto:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Selesai Upload Foto Baru', 'finish_edit_photo')],
            ]));
        }
        if (callbackData === 'finish_edit_photo') {
            const sess = sessions.get(chatId);
            if (!sess || sess.type !== 'edit')
                return;
            const images = sess.data.images && sess.data.images.length > 0
                ? sess.data.images
                : ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'];
            const updated = updateProduct(sess.productId, {
                image: images[0],
                images: images,
            });
            sessions.delete(chatId);
            await ctx.answerCbQuery('Foto berhasil diganti!');
            return ctx.replyWithMarkdown(`✅ *Foto produk berhasil diperbarui!* (${updated?.images?.length || 1} foto terpasang)`);
        }
        const rawSession = sessions.get(chatId);
        if (!rawSession || rawSession.type === 'edit')
            return;
        const session = rawSession;
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
    // Text message handler for wizard & edit
    bot.on('text', async (ctx) => {
        const chatId = ctx.chat.id;
        const text = ctx.message.text.trim();
        if (text.startsWith('/'))
            return;
        const session = sessions.get(chatId);
        if (!session)
            return;
        // Handle Edit Text Inputs
        if (session.type === 'edit') {
            const sess = session;
            // Edit BH via manual text
            if (sess.field === 'bh') {
                const cleanBh = text.includes('%') ? text : `${text}%`;
                const updated = updateProduct(sess.productId, { bh: cleanBh });
                sessions.delete(chatId);
                return ctx.replyWithMarkdown(`✅ *Battery Health berhasil diupdate:*\n*BH ${updated?.bh}*`);
            }
            // Edit Color
            if (sess.field === 'color') {
                const updated = updateProduct(sess.productId, { color: text });
                sessions.delete(chatId);
                return ctx.replyWithMarkdown(`✅ *Warna unit berhasil diupdate:*\n*${updated?.color}*`);
            }
            // Edit Price
            if (sess.field === 'price') {
                const num = parseInt(text.replace(/\D/g, ''), 10);
                if (isNaN(num) || num <= 0) {
                    return ctx.reply('❌ Nominal harga tidak valid. Harap masukkan angka saja (contoh: 12500000).');
                }
                const updated = updateProduct(sess.productId, {
                    price: num,
                    originalPrice: num + 1500000,
                });
                sessions.delete(chatId);
                return ctx.replyWithMarkdown(`✅ *Harga jual berhasil diupdate:*\n*${formatRupiah(updated?.price || num)}*`);
            }
            // Edit Completeness
            if (sess.field === 'completeness') {
                const updated = updateProduct(sess.productId, { completeness: text });
                sessions.delete(chatId);
                return ctx.replyWithMarkdown(`✅ *Kelengkapan berhasil diupdate:*\n*${updated?.completeness}*`);
            }
            // Edit Detail / Minus
            if (sess.field === 'detail') {
                const isMulus = text.toLowerCase() === 'mulus' || text.toLowerCase() === 'tidak ada' || text.toLowerCase() === '-';
                const updated = updateProduct(sess.productId, {
                    desc: text,
                    minus: isMulus ? undefined : text,
                });
                sessions.delete(chatId);
                return ctx.replyWithMarkdown(`✅ *Detail & catatan berhasil diupdate:*\n*${updated?.desc}*`);
            }
            // Edit Photo via text URL
            if (sess.field === 'photo') {
                let imageUrl = text;
                if (text.toLowerCase() === 'default' || !text.startsWith('http')) {
                    imageUrl = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80';
                }
                if (!sess.data.images)
                    sess.data.images = [];
                sess.data.images.push(imageUrl);
                return ctx.replyWithMarkdown(`📥 Foto baru dicatat (${sess.data.images.length} foto).\nKirim foto lainnya atau klik tombol jika selesai:`, Markup.inlineKeyboard([
                    [Markup.button.callback('✅ Selesai Upload Foto Baru', 'finish_edit_photo')],
                ]));
            }
            return;
        }
        // Handle Add wizard (type: add)
        const addSession = session;
        // Handle BH if typed manually instead of clicking button
        if (addSession.step === 6) {
            const cleanBh = text.includes('%') ? text : `${text}%`;
            addSession.data.bh = cleanBh;
            addSession.step = 7;
            await ctx.replyWithMarkdown(`🎨 *[Langkah 7/9]* Masukkan *Warna & Harga* unit ini:\n\nKetik dengan format: *Warna, Harga*\nContoh: \`Natural Titanium, 18500000\`\natau: \`Midnight, 8900000\``);
            return;
        }
        // Step 7: Color and Price in one go!
        if (addSession.step === 7) {
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
            addSession.data.color = color;
            addSession.data.price = price;
            addSession.step = 75; // Intermediary to get kelengkapan
            await ctx.replyWithMarkdown(`📦 *[Langkah 8/9]* Tuliskan *Kelengkapan Unit*:\n\nContoh: \`Fullset Box Original + Kabel C to C\` atau \`Unit Only (Batangan)\` atau \`Dus OEM + Adaptor\``);
            return;
        }
        // Step 75: Kelengkapan
        if (addSession.step === 75) {
            addSession.data.completeness = text;
            addSession.step = 76;
            await ctx.replyWithMarkdown(`📋 Apakah ada *Detail Kondisi / Catatan* pada unit ini?\n\n` +
                `• Klik tombol di bawah jika unit mulus normal tanpa minus\n` +
                `• Atau ketik langsung detailnya (contoh: \`ada lecet halus di sudut bawah bekas case, TrueTone & FaceID aman\`):`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Mulus Normal (Tanpa Minus)', 'desc_mulus')],
            ]));
            return;
        }
        // Step 76: User typed detail note
        if (addSession.step === 76) {
            const isMulus = text.toLowerCase() === 'mulus' || text.toLowerCase() === 'tidak ada' || text.toLowerCase() === '-';
            addSession.data.desc = text;
            if (!isMulus) {
                addSession.data.minus = text;
            }
            addSession.step = 9;
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
        if (addSession.step === 9) {
            let imageUrl = text;
            if (text.toLowerCase() === 'default' || !text.startsWith('http')) {
                imageUrl = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80';
            }
            addSession.data.images.push(imageUrl);
            await ctx.replyWithMarkdown(`📥 Foto berhasil dicatat (${addSession.data.images.length} foto tersimpan).\nKirim foto lagi atau klik tombol di bawah jika sudah selesai:`, Markup.inlineKeyboard([
                [Markup.button.callback('✅ Selesai Upload Foto', 'finish_upload')],
            ]));
            return;
        }
    });
    // Handle direct photo uploads for step 9 & edit photo
    bot.on('photo', async (ctx) => {
        const chatId = ctx.chat.id;
        const session = sessions.get(chatId);
        if (!session)
            return;
        const photos = ctx.message.photo;
        if (!photos || photos.length === 0)
            return;
        const largest = photos[photos.length - 1];
        const link = await ctx.telegram.getFileLink(largest.file_id);
        const photoUrl = link.href;
        // Handle Edit Photo
        if (session.type === 'edit') {
            const editSession = session;
            if (editSession.field === 'photo') {
                if (!editSession.data.images)
                    editSession.data.images = [];
                editSession.data.images.push(photoUrl);
                const total = editSession.data.images.length;
                await ctx.replyWithMarkdown(`📸 *Foto ke-${total} diterima!* Kirim foto lainnya atau klik tombol di bawah jika selesai:`, Markup.inlineKeyboard([
                    [Markup.button.callback(`✅ Selesai Upload (${total} Foto Baru)`, 'finish_edit_photo')],
                ]));
            }
            return;
        }
        // Handle Add Photo
        const addSession = session;
        if (addSession.step === 9) {
            addSession.data.images.push(photoUrl);
            const total = addSession.data.images.length;
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

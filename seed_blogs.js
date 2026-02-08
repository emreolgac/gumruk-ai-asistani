const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const posts = [
        {
            title: "Yapay Zeka ile Gümrük Müşavirliğinde Yeni Dönem",
            slug: "yapay-zeka-gumruk-musavirligi",
            excerpt: "Gümrük süreçlerinde yapay zekanın kullanımı, operasyonel verimliliği nasıl artırıyor? İşte gümrükleme dünyasındaki dijital devrim.",
            content: `
        <p>Gümrük müşavirliği sektörü, tarihindeki en büyük teknolojik dönüşümden geçiyor. Manuel veri girişi ve saatler süren belge incelemeleri yerini akıllı algoritmalara bırakıyor.</p>
        <h3>Operasyonel Verimlilik</h3>
        <p>Bir gümrük dosyasının hazırlanması genellikle onlarca farklı belgenin (fatura, ordino, çeki listesi vb.) dikkatle incelenmesini gerektirir. Gümrük AI Asistanı, bu belgeleri saniyeler içinde tarayarak kritik verileri çıkarır.</p>
        <p><strong>Neden Yapay Zeka?</strong></p>
        <ul>
          <li>Hata payını minimize eder.</li>
          <li>Zaman kazandırır.</li>
          <li>Daha fazla beyanname üretme kapasitesi sağlar.</li>
        </ul>
        <h3>Geleceğin Gümrük Ofisi</h3>
        <p>Artık her şey daha dijital, daha hızlı ve daha güvenli. İşletmenizi bu yeni döneme hazırlamak için Gümrük AI araçlarını kullanmaya bugün başlayın.</p>
      `,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
            isActive: true
        },
        {
            title: "GTİP Kodlarını Belirlemede Hız ve Doğruluk",
            slug: "gtip-kodu-belirleme-hizi",
            excerpt: "Yanlış GTİP kodları mali riskler yaratır. Yapay zeka destekli analiz araçları ile hatasız ve hızlı beyanname hazırlama rehberi.",
            content: `
        <p>Gümrükleme işlemlerinde belki de en hassas nokta GTİP (Gümrük Tarife İstatistik Pozisyonu) kodlarının doğru belirlenmesidir. Yanlış bir kod, hem vergi cezalarına hem de gümrükte takılmalara neden olabilir.</p>
        <h3>Yapay Zeka GTİP Çıkarmada Nasıl Yardımcı Olur?</h3>
        <p>Yapay zeka modellerimiz, fatura üzerindeki ürün tanımlarını okuyarak dünya üzerindeki devasa veri setleriyle karşılaştırır ve en doğru GTİP kodunu önerir.</p>
        <p>Bu süreç, gümrük müşavirinin işini kolaylaştırırken, karar verme sürecini hızlandırır.</p>
        <blockquote>"Doğru GTİP, doğru vergi ve sorunsuz ticaret demektir."</blockquote>
        <p>Siz de manuel aramalarla vakit kaybetmek yerine akıllı asistanımızdan destek alabilirsiniz.</p>
      `,
            image: "https://images.unsplash.com/photo-1586769852044-692d6e3703a0?auto=format&fit=crop&q=80&w=1200",
            isActive: true
        },
        {
            title: "Dijital Gümrük: Belgelerinizi Saniyeler İçinde Analiz Edin",
            slug: "dijital-gumruk-belge-analizi",
            excerpt: "Fatura, ordino ve çeki listesi gibi karmaşık belgeleri manuel veri girişinden kurtarın. Gümrük AI ile saniyeler içinde dijitalleşin.",
            content: `
        <p>Kağıt yığınları ve karmaşık exceller arasında boğulmaya son. Gümrük AI Asistanı, her türlü belge tipini tanıma yeteneğine sahiptir.</p>
        <p>Sistemimiz şu belgeleri saniyeler içinde dijital veriye dönüştürür:</p>
        <ol>
          <li>Fatura (Invoice)</li>
          <li>Ordino (Delivery Order)</li>
          <li>Çeki Listesi (Packing List)</li>
          <li>A.TR ve Menşe Şahadetnameleri</li>
        </ol>
        <p>Veri güvenliği en üst seviyededir. Yüklediğiniz her belge şifreli bir şekilde işlenir ve sadece sizin erişiminize sunulur.</p>
        <p>Gümrük süreçlerinizi modernize etmek için beklemeyin.</p>
      `,
            image: "https://images.unsplash.com/photo-1454165833267-0331235011f1?auto=format&fit=crop&q=80&w=1200",
            isActive: true
        }
    ];

    for (const post of posts) {
        await prisma.blogPost.create({
            data: post
        });
    }

    console.log('3 blog posts created successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

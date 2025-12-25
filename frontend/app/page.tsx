import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryGrid from '@/components/CategoryGrid';
import Testimonials from '@/components/Testimonials';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroBanner />
      <FeaturedProducts />
      <CategoryGrid />
      <Testimonials />
      <NewsletterSignup />
      <Footer />
    </main>
  );
}

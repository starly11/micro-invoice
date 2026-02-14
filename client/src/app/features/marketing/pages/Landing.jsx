import Hero from '../components/Hero'
import Features from '../components/Feature'
import HowItWorks from '../components/HowItWorks'
import TemplateShowcase from '../components/TemplateShowCase'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import MarketingNav from '../components/MarketingNav'
import SocialProofSection from '../components/SocialProofSection'
import FounderStory from '../components/FounderStory'
export const Landing = () => {
    return (
        <main className="min-h-screen bg-background">
            <MarketingNav />
            <Hero />
            <FounderStory />
            <SocialProofSection />
            <Features />
            <HowItWorks />
            <TemplateShowcase />
            <Pricing />
            <FAQ />
            <Footer />
        </main>
    )
}

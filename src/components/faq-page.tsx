import Header from "@/components/header.tsx";
import Footer from "@/components/footer.tsx";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "How do I create an account?",
        answer:
            "To create an account, click on the Sign Up button on the top right and fill out the registration form.",
    },
    {
        question: "How can I reset my password?",
        answer:
            "If you forgot your password, use the 'Forgot Password' link on the login page to reset it via email.",
    },
    {
        question: "How do I delete my account?",
        answer:
            "You can delete your account from the settings page under the 'Delete Account' section. Please note this action is irreversible.",
    },
    {
        question: "Who can I contact for support?",
        answer:
            "For support, please email valorium@company.com or use the contact form on our website.",
    },
];

export default function FAQPage() {
    return (
        <>
            <Header pageName="FAQ" />
            <main className="max-w-3xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                <Accordion type="single" collapsible>
                    {faqData.map(({ question, answer }, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                            <AccordionTrigger>{question}</AccordionTrigger>
                            <AccordionContent>
                                <p>{answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
            <Footer
                active="home"
                onSelect={(section) => {
                    console.log(`Selected section: ${section}`);
                }}
            />
        </>
    );
}

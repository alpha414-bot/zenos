
import MainLayout from "@/Layouts/MainLayout";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Zenos?",
      answer: "Zenos is an innovative platform that connects individuals to quality phone accessories and a secure marketplace for buying and selling pre-loved items. We also offer opportunities for financial empowerment through our affiliate marketing program."
    },
    {
      question: "What products can I find on Zenos?",
      answer: "We offer a wide range of phone accessories, including chargers, cases, and headphones, as well as a marketplace for buying and selling used products."
    },
    {
      question: "How does Zenos ensure the safety of used products?",
      answer: "We strive to create a secure and transparent marketplace. Buyers get their products before payment is made to the sellers for safety purposes, and detailed product descriptions are provided to help buyers make informed decisions."
    },
    {
      question: "Does Zenos deliver products?",
      answer: "Yes, we deliver phone accessories and other items directly to your doorstep, providing convenience and saving you time."
    },
    {
      question: "How does the affiliate marketing program work?",
      answer: "As an affiliate, you’ll receive a unique referral code. When someone uses your code to make a purchase, you earn 30% of the profit from the sale."
    },
    {
      question: "Can I sell my used products on Zenos?",
      answer: "Yes! Our platform allows you to list and sell your used items at fair prices from the comfort of your home."
    },
    {
      question: "How do I contact Zenos for support?",
      answer: "You can reach our Customer Support Team via: Email: Zenosmarketplace@gmail.com"
    },
    {
      question: "How do I join the Zenos team?",
      answer: "You can join Zenos as an affiliate, Zenos offers exciting opportunities. Reach out to us at 09131735970 to learn more about joining."
    },
    {
      question: "What makes Zenos different?",
      answer: "Zenos is more than just a marketplace; it’s a platform built on empowerment, convenience, and sustainability. We’re here to simplify your shopping experience while helping you achieve your financial goals."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-900 text-white min-h-screen py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-10">Zenos Frequently Asked Questions (FAQ)</h1>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-orange-400 mb-2">{faq.question}</h2>
              <p className="text-base sm:text-lg">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
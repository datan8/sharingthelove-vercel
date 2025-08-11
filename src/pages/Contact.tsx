import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Heart, Users } from "lucide-react";
import { sendContactEmail } from "@/lib/sendEmail";
import { env } from '@/lib/env';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await sendContactEmail(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: "Thank you for reaching out! We'll get back to you soon and look forward to sharing our mission with you."
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-emerald-800 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-emerald-700 leading-relaxed">
            Have questions about our products or mission? Want to learn more about
            how your purchase creates positive change? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="border-emerald-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-rose-500 mr-3" />
                  <h2 className="text-3xl font-bold text-emerald-800">Send Us a Message</h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Whether you're interested in our products, want to learn about our impact in Vietnam,
                  or have suggestions for our mission, we're here to connect.
                </p>

                {/* Status Message */}
                {submitStatus.type && (
                  <div className={`p-4 rounded-md mb-6 ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-emerald-800">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-emerald-800">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-emerald-800">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-emerald-800">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[150px] rounded-md border border-emerald-200 focus:border-emerald-500 p-3"
                      placeholder="Tell us about your interest in our products, questions about our mission, or how we can help you..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Mission */}
            <div className="space-y-8">
              <Card className="border-emerald-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-blue-600 mr-3" />
                    <h2 className="text-3xl font-bold text-emerald-800">Contact Information</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="mr-4 h-6 w-6 text-emerald-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-emerald-800">Email</h3>
                        <p className="text-gray-600">{env.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Impact Card */}
              <Card className="border-emerald-200 bg-emerald-50 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                    Your Purchase Creates Change
                  </h3>
                  <p className="text-gray-700 mb-6">
                    When you reach out to us or make a purchase, you're not just buying a product –
                    you're investing in vulnerable communities in Vietnam.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brandGold">64</div>
                      <p className="text-sm text-gray-600">Orphans Supported</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">10+</div>
                      <p className="text-sm text-gray-600">Years of Service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — LeadBron",
  description:
    "LeadBron terms of service, including our delivery, refund and cancellation policies for lead purchases.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-3xl font-800 text-ink">Terms &amp; Conditions</h1>
      <p className="mt-2 font-mono text-xs text-moss">Last updated: 5 August 2026</p>

      <div className="mt-6 rounded-lg border border-moss/20 bg-white p-5">
        <p className="font-display text-sm font-700 text-ink">Quick links</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <a className="text-brassdeep underline hover:text-brass" href="#delivery">
            Delivery policy
          </a>
          <a className="text-brassdeep underline hover:text-brass" href="#refunds">
            Refund policy
          </a>
          <a className="text-brassdeep underline hover:text-brass" href="#cancellation">
            Cancellation policy
          </a>
          <a className="text-brassdeep underline hover:text-brass" href="#contact">
            Contact us
          </a>
        </div>
      </div>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ink/90">
        <section>
          <h2 className="font-display text-xl font-700 text-ink">1. About these terms</h2>
          <p className="mt-2">
            These terms govern your use of the LeadBron website and, where you purchase
            leads from us, the agreement between you and LeadBron (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;). By placing an order you agree to these terms. They are
            governed by the laws of the Republic of South Africa.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">2. What we sell</h2>
          <p className="mt-2">
            LeadBron operates a lead marketplace. Members of the public request a quote
            for a financial product and give explicit, timestamped consent, in line with
            the Protection of Personal Information Act, to be contacted by one accredited
            financial adviser. We supply those lead records to advisers who purchase them.
          </p>
          <p className="mt-2">
            A &ldquo;lead&rdquo; is a data record containing the person&rsquo;s name, email
            address, telephone number, province, any notes they provided, and the date and
            time of their consent. Each lead is sold <strong>once only</strong>, on an
            exclusive basis, and is not resold to any other buyer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">3. Who may buy</h2>
          <p className="mt-2">
            Leads are sold for business use by financial advisers and related businesses.
            By purchasing you confirm that you are authorised to contact consumers about
            financial products in South Africa, that you hold any licence or accreditation
            required to do so, and that you will process the personal information in each
            lead lawfully and only for the purpose for which the person consented.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">4. Pricing and payment</h2>
          <p className="mt-2">
            Prices are shown per lead in South African Rand on our order page and are
            payable in full before delivery. Payments are processed by PayFast. We do not
            receive or store your card details. Your order is confirmed once PayFast
            notifies us that payment has succeeded.
          </p>
        </section>

        <section id="delivery" className="scroll-mt-8">
          <h2 className="font-display text-xl font-700 text-ink">5. Delivery policy</h2>
          <p className="mt-2">
            Leads are delivered <strong>electronically only</strong>. No physical goods are
            shipped, and no delivery charges apply.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Immediate delivery.</strong> As soon as payment is confirmed, we
              allocate the leads available in your chosen category and email them to the
              address on your order as a CSV file attachment. This is normally within a
              few minutes of payment.
            </li>
            <li>
              <strong>Partial delivery.</strong> Leads are a finite, live stock. If fewer
              leads are available than you ordered, we deliver everything in stock
              immediately and your order remains open for the balance.
            </li>
            <li>
              <strong>Automatic completion.</strong> The outstanding balance is delivered
              automatically, by email, as new leads arrive in that category. Open orders
              are filled in the sequence they were placed, oldest first.
            </li>
            <li>
              <strong>Delivery address.</strong> Leads are sent to the email address you
              provide at checkout. Please make sure it is correct and can receive
              attachments, and check your spam folder before contacting us.
            </li>
          </ul>
        </section>

        <section id="refunds" className="scroll-mt-8">
          <h2 className="font-display text-xl font-700 text-ink">6. Refund policy</h2>
          <p className="mt-2">
            Leads are digital goods supplied immediately, and once a lead has been
            delivered to you the personal information in it cannot be returned or
            un-disclosed. Delivered leads are therefore generally not refundable. The
            following exceptions apply, and we honour them in good faith.
          </p>

          <h3 className="mt-4 font-display font-700 text-ink">6.1 Undelivered leads</h3>
          <p className="mt-2">
            If we have not delivered your full order within <strong>30 days</strong> of
            payment, you may request a refund of the undelivered portion, calculated at
            the price per lead you paid. We refund this in full, without deduction. You
            may also request that refund earlier if you no longer want to wait for stock.
          </p>

          <h3 className="mt-4 font-display font-700 text-ink">6.2 Faulty leads</h3>
          <p className="mt-2">
            We will replace, or at your election credit, any delivered lead where:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>the telephone number supplied is not a working number;</li>
            <li>the email address supplied is invalid and bounces;</li>
            <li>the contact details are duplicated within the same order; or</li>
            <li>the person confirms they never requested a quote.</li>
          </ul>
          <p className="mt-2">
            Report faulty leads to us within <strong>7 days</strong> of delivery, with the
            lead reference and a short description of the problem. We aim to resolve
            claims within 5 business days.
          </p>

          <h3 className="mt-4 font-display font-700 text-ink">6.3 What is not refundable</h3>
          <p className="mt-2">
            A lead is a request for contact, not a guarantee of a sale. We cannot refund a
            lead simply because the person did not answer the phone, changed their mind,
            declined a quote, was not eligible for a product, or did not buy from you.
            Conversion depends on your own follow-up and we make no representation about it.
          </p>

          <h3 className="mt-4 font-display font-700 text-ink">6.4 How refunds are paid</h3>
          <p className="mt-2">
            Approved refunds are paid back to the original payment method through PayFast,
            normally within 10 business days of approval. Your bank may take a few further
            days to reflect it. We do not charge a fee to process a refund.
          </p>
        </section>

        <section id="cancellation" className="scroll-mt-8">
          <h2 className="font-display text-xl font-700 text-ink">7. Cancellation policy</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <strong>Before payment.</strong> An order that has not been paid carries no
              obligation. Simply do not complete the PayFast payment, and nothing is
              charged.
            </li>
            <li>
              <strong>After payment, before any delivery.</strong> If you contact us before
              any leads have been delivered, we will cancel the order and refund you in
              full.
            </li>
            <li>
              <strong>After partial delivery.</strong> You may cancel the outstanding
              balance of an open order at any time and receive a full refund of the
              undelivered portion. Leads already delivered are subject to the refund policy
              above.
            </li>
            <li>
              <strong>Cancellation by us.</strong> We may cancel and refund an order in
              full if we cannot verify that you are entitled to contact consumers about
              financial products, or if we reasonably believe the leads would be used
              unlawfully.
            </li>
          </ul>
          <p className="mt-3">
            There are no subscriptions or recurring charges. Every order is once-off, so
            there is nothing to cancel between purchases.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">8. Your obligations as a buyer</h2>
          <p className="mt-2">
            When you buy a lead you become a responsible party for that person&rsquo;s
            personal information under POPIA. You agree to contact them only about the
            product they enquired about, to honour any request to stop contacting them or
            to delete their information, to keep the information secure, and not to resell,
            share, or add it to any marketing list. We may suspend or refuse service to a
            buyer who does not.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">9. Consumer rights</h2>
          <p className="mt-2">
            Nothing in these terms limits any right you may have under the Consumer
            Protection Act, 68 of 2008, the Electronic Communications and Transactions Act,
            25 of 2002, or any other law that applies to you and cannot be excluded by
            agreement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">10. Liability</h2>
          <p className="mt-2">
            We provide the marketplace with reasonable care, but we do not warrant that any
            lead will result in a sale, or that the service will be uninterrupted or
            error-free. To the extent the law allows, our total liability arising from any
            order is limited to the amount you paid for that order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-700 text-ink">11. Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. The version published on this page
            at the moment you place an order is the version that applies to that order. The
            date at the top shows when they were last changed.
          </p>
        </section>

        <section id="contact" className="scroll-mt-8">
          <h2 className="font-display text-xl font-700 text-ink">12. Contact and complaints</h2>
          <p className="mt-2">
            For any order, delivery, refund, or cancellation query, contact us and we will
            respond as quickly as we can:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Email:{" "}
              <a className="text-brassdeep underline" href="mailto:support@leadbron.co.za">
                support@leadbron.co.za
              </a>
            </li>
            <li>
              Privacy and POPIA matters:{" "}
              <a className="text-brassdeep underline" href="mailto:privacy@leadbron.co.za">
                privacy@leadbron.co.za
              </a>{" "}
              (see our <Link className="text-brassdeep underline" href="/privacy">Privacy Policy</Link>)
            </li>
            <li>LeadBron is operated from the Western Cape, South Africa.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

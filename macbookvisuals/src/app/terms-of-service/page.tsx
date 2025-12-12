// app/terms-of-service/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MacBookVisuals",
  description: "Terms governing the use of macbookvisuals.com. Uploads are temporary; no accounts or data collection.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: [Insert Date]</p>

      <section className="space-y-6 text-lg leading-relaxed">
        <p>
          These Terms of Service govern your use of <strong>macbookvisuals.com</strong>,{" "}
          <strong>macbookvisuals.co.uk</strong>, and <strong>macbookvisuals.uk</strong>. By using our
          website, you agree to the following terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Use of the Service</h2>
        <p>You agree not to:</p>
        <ul className="list-disc ml-6">
          <li>Upload unlawful or copyrighted content without permission</li>
          <li>Submit harmful files, malware, or disruptive scripts</li>
          <li>Attempt to reverse-engineer or damage the platform</li>
          <li>Use the site for abusive or malicious purposes</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. User Uploads</h2>
        <p>
          You retain full ownership of your uploaded media. By uploading, you grant us temporary
          permission to process files to provide the service.
        </p>
        <p>
          Files are <strong>not stored permanently</strong>, <strong>not reused</strong>, and{" "}
          <strong>not shared</strong> with any party.
        </p>

        <h2 className="text-2xl font-semibold mt-8">3. No Data Collection</h2>
        <p>
          We do not collect personal information, store analytics, use cookies, or integrate any
          third-party tracking services.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. No Warranty</h2>
        <p>
          MacBookVisuals is provided “as is” without warranties. We do not guarantee uninterrupted or
          error-free service.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Limitation of Liability</h2>
        <p>
          We are not responsible for damages arising from the use or inability to use the website,
          including loss of data from temporary upload handling.
        </p>

        <h2 className="text-2xl font-semibold mt-8">6. Changes to These Terms</h2>
        <p>
          Terms may be updated periodically. Continued use of the site constitutes acceptance of updated
          terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8">7. Contact</h2>
        <p>
          For questions regarding these Terms of Service, email us at:
        </p>
        <p className="font-semibold">contact@macbookvisuals.com</p>
      </section>
    </main>
  );
}

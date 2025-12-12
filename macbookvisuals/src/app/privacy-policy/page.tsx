// app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MacBookVisuals",
  description: "Privacy policy for macbookvisuals.com. We collect no personal data and store uploads only temporarily.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: [Insert Date]</p>

      <section className="space-y-6 text-lg leading-relaxed">
        <p>
          Welcome to <strong>MacBookVisuals</strong> (accessible via{" "}
          <em>macbookvisuals.com</em>, <em>macbookvisuals.co.uk</em>, and{" "}
          <em>macbookvisuals.uk</em>). We are committed to privacy and transparency.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Information We Collect</h2>
        <p>
          We intentionally collect <strong>no personal data</strong>. We do not store or track:
        </p>
        <ul className="list-disc ml-6">
          <li>Names or email addresses</li>
          <li>IP addresses</li>
          <li>Cookies or browser identifiers</li>
          <li>Analytics or tracking information</li>
          <li>Any identifiable data</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Uploaded Files</h2>
        <p>
          Users may upload media files for processing. All uploaded content is{" "}
          <strong>stored temporarily</strong> and automatically deleted shortly after processing. We do not
          retain copies or use uploads for any other purpose.
        </p>

        <h2 className="text-2xl font-semibold mt-8">3. No Third-Party Services</h2>
        <p>We do not use:</p>
        <ul className="list-disc ml-6">
          <li>Google Analytics</li>
          <li>Advertising networks</li>
          <li>External data processors</li>
          <li>Tracking or profiling tools</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">4. Children's Privacy</h2>
        <p>
          Our service does not collect personal data from anyone, including children. The website is not
          specifically targeted toward minors.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Your Rights</h2>
        <p>
          As we do not store any personal information, rights related to accessing or deleting stored
          data do not apply. If you have questions regarding temporary file storage, contact us at:
        </p>
        <p className="font-semibold">contact@macbookvisuals.com</p>

        <h2 className="text-2xl font-semibold mt-8">6. Changes to This Policy</h2>
        <p>
          Updated versions of this Privacy Policy will appear on this page with an updated date stamp.
        </p>
      </section>
    </main>
  );
}

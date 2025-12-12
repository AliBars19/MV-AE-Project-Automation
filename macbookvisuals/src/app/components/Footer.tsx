// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full mt-12">
      {/* Divider Line */}
      <div className="w-full h-px bg-white/10 mb-4"></div>

      {/* Footer Content */}
      <div className="w-full py-4 flex justify-center items-center gap-6 text-sm text-gray-400">
        <a href="/privacy-policy" className="hover:text-white transition">
          Privacy Policy
        </a>
        <span>|</span>
        <a href="/terms-of-service" className="hover:text-white transition">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}

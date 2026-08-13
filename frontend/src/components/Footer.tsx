import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#ebebeb] bg-[#f7f7f7]">
      <div className="mx-auto grid max-w-[1760px] gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
        <div>
          <h3 className="mb-4 font-semibold">Support</h3>
          <ul className="space-y-3 text-sm text-[#222]">
            <li><span className="cursor-not-allowed opacity-60">Help Centre</span></li>
            <li><span className="cursor-not-allowed opacity-60">AirCover</span></li>
            <li><span className="cursor-not-allowed opacity-60">Cancellation options</span></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Hosting</h3>
          <ul className="space-y-3 text-sm text-[#222]">
            <li><Link href="/host" className="hover:underline">Airbnb your home</Link></li>
            <li><span className="cursor-not-allowed opacity-60">AirCover for Hosts</span></li>
            <li><span className="cursor-not-allowed opacity-60">Hosting resources</span></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Airbnb</h3>
          <ul className="space-y-3 text-sm text-[#222]">
            <li><span className="cursor-not-allowed opacity-60">Newsroom</span></li>
            <li><span className="cursor-not-allowed opacity-60">Careers</span></li>
            <li><span className="cursor-not-allowed opacity-60">Investors</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#ddd] px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-4 text-sm text-[#717171] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Airbnb Clone — SDE Assignment Demo</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

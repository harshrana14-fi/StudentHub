import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-white text-black inline-block px-6 py-3 border-4 border-white mb-4">
            <h3 className="text-3xl font-black">StudentHub</h3>
          </div>
          <p className="text-white font-medium mb-2">
            Empowering students with AI-powered tools for academic success
          </p>
          <p className="text-gray-400 font-bold mb-6">
            Created with ❤️ by Harsh Rana
          </p>
          <div className="border-t-2 border-white pt-8">
            <p className="text-gray-400 font-bold">
              © 2024 StudentHub. Built with care for students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import {
  Pen,
  Users,
  Download,
  Zap,
  Star,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Sparkles,
  Globe,
  Shield,
} from "lucide-react";
import "./globals.css";
import { useRouter } from "next/navigation";
import { useAuth } from "./services/hooks/useAuth";
import { Navigation } from "./components/Navigation";

function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navigation />

      <section className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-300">
                Now with real-time collaboration
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Draw Ideas</span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Into Reality
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The most intuitive collaborative whiteboard for teams. Create
              beautiful diagrams, wireframes, and illustrations with a
              hand-drawn aesthetic that brings ideas to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
                onClick={() => router.push("/auth/signin")}
              >
                <span className="relative z-10 flex items-center space-x-2 text-lg font-semibold">
                  <span>Start Drawing Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button onClick={() => window.open("https://github.com/ShivamH1/x-draw", "_blank")} className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span className="text-lg font-semibold">View Source</span>
              </button>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gray-800/80 rounded-2xl p-8 min-h-[500px] border border-gray-700/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      Untitled Drawing
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-gray-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-gray-800"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      3 collaborators
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-8 min-h-[400px] flex items-center justify-center border border-gray-700/30">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <Pen className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Interactive Canvas
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Infinite canvas with smooth drawing, real-time
                      collaboration, and beautiful hand-drawn aesthetics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              <span className="text-white">for Creative Teams</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to transform ideas into beautiful visual
              representations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Real-time Collaboration",
                description:
                  "Work together seamlessly with unlimited team members. See cursors, changes, and edits in real-time.",
                color: "from-cyan-400 to-blue-500",
                bgColor: "from-cyan-500/10 to-blue-500/10",
              },
              {
                icon: Pen,
                title: "Hand-drawn Aesthetic",
                description:
                  "Create beautiful diagrams with a natural, sketchy style that makes your work stand out.",
                color: "from-purple-400 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10",
              },
              {
                icon: Download,
                title: "Export Everywhere",
                description:
                  "Export in multiple formats: PNG, SVG, PDF, or share with a simple link.",
                color: "from-green-400 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: Zap,
                title: "Lightning Performance",
                description:
                  "Optimized for speed with smooth 60fps drawing and instant responsiveness.",
                color: "from-yellow-400 to-orange-500",
                bgColor: "from-yellow-500/10 to-orange-500/10",
              },
              {
                icon: Globe,
                title: "Works Everywhere",
                description:
                  "Browser-based with no downloads required. Works on desktop, tablet, and mobile.",
                color: "from-indigo-400 to-purple-500",
                bgColor: "from-indigo-500/10 to-purple-500/10",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "Your data stays yours. End-to-end encryption and no tracking of your creative work.",
                color: "from-red-400 to-pink-500",
                bgColor: "from-red-500/10 to-pink-500/10",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                {
                  number: "50K+",
                  label: "Active Users",
                  color: "text-cyan-400",
                },
                {
                  number: "1M+",
                  label: "Drawings Created",
                  color: "text-purple-400",
                },
                { number: "99.9%", label: "Uptime", color: "text-green-400" },
                { number: "24/7", label: "Support", color: "text-yellow-400" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div
                    className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Teams Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "X-Draw has revolutionized how our design team collaborates. The real-time features are incredible.",
                author: "Sarah Chen",
                role: "Design Lead at TechCorp",
                avatar: "from-cyan-400 to-blue-500",
              },
              {
                quote:
                  "The hand-drawn aesthetic makes our presentations stand out. Clients love the unique style.",
                author: "Marcus Rodriguez",
                role: "Product Manager at StartupXYZ",
                avatar: "from-purple-400 to-pink-500",
              },
              {
                quote:
                  "Finally, a drawing tool that's both powerful and intuitive. Our whole team adopted it instantly.",
                author: "Emily Watson",
                role: "UX Director at DesignStudio",
                avatar: "from-green-400 to-emerald-500",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.avatar} rounded-full`}
                  ></div>
                  <div>
                    <div className="text-white font-semibold">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Ideas?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of creators and teams who use X-Draw to bring
                their visions to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => router.push("/auth/signin")} className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center space-x-2 text-lg font-semibold">
                    <span>Start Creating Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="border-2 border-gray-600 text-gray-300 px-10 py-4 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 text-lg font-semibold">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50 py-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <Pen className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur opacity-50 animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  X-Draw
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The modern collaborative whiteboard that brings your ideas to
                life with beautiful, hand-drawn aesthetics and powerful team
                features.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/ShivamH1/x-draw"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 hover:scale-110 transform"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://x.com/shivam_honrao"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 hover:scale-110 transform"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="mailto:shivamhonrao@gmail.com"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 hover:scale-110 transform"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Updates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 X-Draw. All rights reserved. Built with ❤️ for
              creators everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

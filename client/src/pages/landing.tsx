import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, TrendingUp, Users, DollarSign } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">SmartDev</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI-Powered <span className="text-blue-400">Earning Platform</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Accelerate your development projects with AI assistance while earning through our 
            innovative platform. Join thousands of developers already earning.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SmartDev?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI tools with a secure earning system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Lightning Fast Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Build production-ready applications in 2-3 days using AI-assisted workflows
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Earn While Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Complete AI tasks and projects to earn rewards directly to your wallet
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Bank-level security with instant deposits and fast withdrawal processing
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-400 mb-4" />
                <CardTitle className="text-white">Track Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Real-time analytics and earnings tracking with detailed transaction history
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <Users className="h-12 w-12 text-pink-400 mb-4" />
                <CardTitle className="text-white">Active Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Join a growing community of developers leveraging AI for better productivity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <Brain className="h-12 w-12 text-cyan-400 mb-4" />
                <CardTitle className="text-white">AI Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Seamless integration with Replit, Bolt, Cursor, and other AI development tools
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join SmartDev today and transform your development workflow while earning rewards
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 SmartDev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

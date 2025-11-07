"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Volume2, Shield, HelpCircle, Info, ExternalLink, FileText } from "lucide-react"

export default function SettingsPage() {
  return (
    <div
      className="relative min-h-screen pb-24 page-fade"
      style={{ background: "linear-gradient(to bottom, #e8e4f3, white, #f9fafb)" }}
    >
      <main className="px-4 pt-6 max-w-2xl mx-auto animate-in fade-in duration-300">
        <h1 className="text-[32px] font-extrabold text-gray-900 mb-6 leading-none tracking-tight">Settings</h1>

        {/* Notifications */}
        <Card className="mb-4 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-gray-900 tracking-tight">
              <Bell className="h-5 w-5 text-[#4A7FE8]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-600 leading-relaxed">Get notified about new games</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Game Updates</p>
                <p className="text-xs text-gray-600 leading-relaxed">Updates about your favorite games</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Rewards Alerts</p>
                <p className="text-xs text-gray-600 leading-relaxed">Get notified about rewards</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
          </CardContent>
        </Card>

        {/* Sound & Vibration */}
        <Card className="mb-4 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-gray-900 tracking-tight">
              <Volume2 className="h-5 w-5 text-[#4A7FE8]" />
              Sound & Vibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Sound Effects</p>
                <p className="text-xs text-gray-600 leading-relaxed">In-app sound effects</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Haptic Feedback</p>
                <p className="text-xs text-gray-600 leading-relaxed">Vibration on interactions</p>
              </div>
              <Switch className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-4 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-gray-900 tracking-tight">
              <Shield className="h-5 w-5 text-[#4A7FE8]" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Show Profile</p>
                <p className="text-xs text-gray-600 leading-relaxed">Make your profile visible</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-bold text-gray-900">Share Activity</p>
                <p className="text-xs text-gray-600 leading-relaxed">Share your gaming activity</p>
              </div>
              <Switch className="data-[state=checked]:bg-[#4A7FE8]" />
            </div>
          </CardContent>
        </Card>

        {/* Support & Info */}
        <Card className="mb-4 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-extrabold text-gray-900 tracking-tight">
              <Info className="h-5 w-5 text-[#4A7FE8]" />
              Support & Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-900 hover:bg-gray-100/80 active:scale-98 transition-all rounded-xl h-12 touch-manipulation"
            >
              <span className="flex items-center gap-2.5 font-bold">
                <HelpCircle className="h-4 w-4 text-[#4A7FE8]" />
                Help Center
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-900 hover:bg-gray-100/80 active:scale-98 transition-all rounded-xl h-12 touch-manipulation"
            >
              <span className="flex items-center gap-2.5 font-bold">
                <FileText className="h-4 w-4 text-[#4A7FE8]" />
                Terms of Service
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between text-gray-900 hover:bg-gray-100/80 active:scale-98 transition-all rounded-xl h-12 touch-manipulation"
            >
              <span className="flex items-center gap-2.5 font-bold">
                <FileText className="h-4 w-4 text-[#4A7FE8]" />
                Privacy Policy
              </span>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="mb-4 bg-white border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-[22px] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-[400ms]">
          <CardContent className="pt-6 pb-6 text-center space-y-2">
            <div className="text-5xl mb-3">🍌</div>
            <h3 className="font-black text-xl text-[#4A7FE8] tracking-tight">PIMPANANAS</h3>
            <p className="text-sm font-semibold text-gray-600">Version 1.0.0</p>
            <p className="text-xs text-gray-500 leading-relaxed">© 2025 PIMPANANAS. All rights reserved.</p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}

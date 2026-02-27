"use client";

import { useState } from "react";
import { Compass, MapPin, Sparkles, ArrowRight, Plane, Clock } from "lucide-react";
import { TravelPlannerModal } from "@/components/travel/travel-planner-modal";
import { TravelPlannerForm } from "@/components/travel/travel-planner-form";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

export default function HomePage() {
  const [openPlanner, setOpenPlanner] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-background dark:to-background"></div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: -10 }}
          transition={{ type: "spring", delay: 0.5, duration: 1 }}
          className="absolute top-20 left-10 md:left-20"
        >
          <div className="glass p-3 rounded-2xl">
            <Plane className="w-6 h-6 text-primary" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 30 }}
          animate={{ opacity: 1, scale: 1, rotate: 15 }}
          transition={{ type: "spring", delay: 0.7, duration: 1 }}
          className="absolute bottom-40 right-10 md:right-20"
        >
          <div className="glass p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-secondary" />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Travel Planning</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-tight">
            Design your dream trip in <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">seconds</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Tell us where you want to go, and our AI will craft a personalized itinerary complete with activities, hotels, and budgets.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto rounded-full gap-2 shadow-lg hover:shadow-xl transition-all" onClick={() => setOpenPlanner(true)}>
              Start Planning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full glass-card hover:bg-white/50">
              Explore Destinations
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-3xl text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Smart Itineraries</h3>
              <p className="text-muted-foreground">Day-by-day plans optimized for your pace and preferences.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-3xl text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Local Insights</h3>
              <p className="text-muted-foreground">Discover hidden gems and top-rated accommodations.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-3xl text-center space-y-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto text-orange-600 dark:text-orange-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Instant Estimates</h3>
              <p className="text-muted-foreground">Get reliable cost breakdowns for transport, stays, and activities.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <TravelPlannerModal
        open={openPlanner}
        onClose={() => setOpenPlanner(false)}
      >
        <TravelPlannerForm />
      </TravelPlannerModal>
    </div>
  );
}


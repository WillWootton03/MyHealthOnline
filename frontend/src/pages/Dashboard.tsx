import DailyCalorieDisplay from "../components/DailyCalorieDisplay";
import { motion } from 'motion/react';


export default function Dashboard() {

  return (
    <motion.div 
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
      className="min-h-screen page-bg-light"
    >
      <main className="max-w-7xl mx-auto px-5 py-7 space-y-6">
        <DailyCalorieDisplay />
      </main>
    </motion.div>
  );
}
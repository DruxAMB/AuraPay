import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Landing } from "../pages/Landing/Landing";
import { Home } from "../pages/Home/Home";
import { Splash } from "../pages/Splash/Splash";
import { Auth } from "../pages/Auth/Auth";
import { Withdraw } from "../pages/Withdraw/Withdraw";
import { Receive } from "../pages/Receive/Receive";
import { Settings } from "../pages/Settings/Settings";
import { Transactions } from "../pages/Transactions/Transactions";
import { TestTransaction } from "../pages/TestTransaction";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.3,
};

// Wrapper component for animated routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/splash"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Splash />
            </motion.div>
          }
        />
        <Route
          path="/auth"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Auth />
            </motion.div>
          }
        />
        <Route
          path="/home"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/withdraw"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Withdraw />
            </motion.div>
          }
        />
        <Route
          path="/receive"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Receive />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Settings />
            </motion.div>
          }
        />
        <Route
          path="/transactions"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Transactions />
            </motion.div>
          }
        />
        <Route
          path="/test-transaction"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TestTransaction />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default AppRoutes;

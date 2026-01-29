import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

function AnimatedNumber({ value }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      val: value,
      transition: { duration: 0.6, ease: "easeOut" },
    });
  }, [value]);

  return (
    <motion.span
      animate={controls}
      initial={{ val: 0 }}
      variants={{
        val: {
          transition: { duration: 0.5 },
        },
      }}
    >
      {Math.floor(value)}
    </motion.span>
  );
}

export default function DashboardCards({ items }) {
  const totalItems = items.length;
  const lowStockItems = items.filter((i) => Number(i.qty) < 5).length;
  const totalValue = items.reduce(
    (sum, i) => sum + Number(i.qty) * Number(i.price),
    0
  );

  return (
    <div className="dashboard-cards">
      <div className="card total">
        <h3>Total Items</h3>
        <p>
          <AnimatedNumber value={totalItems} />
        </p>
      </div>
      <div className="card low">
        <h3>Low Stock</h3>
        <p>
          <AnimatedNumber value={lowStockItems} />
        </p>
      </div>
      <div className="card value">
        <h3>Total Value</h3>
        <p>
          ₹<AnimatedNumber value={totalValue} />
        </p>
      </div>
    </div>
  );
}

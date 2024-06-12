import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './HomePage.css';

const HomePage = () => {
  const colors = useMemo(
    () => [
      '#FFFFFF',
      '#C16855',
      '#FCC474',
      '#1EB17C',
      '#D8CDC3',
      '#FFD699 ',
      '#374151 ',
    ],
    []
  );

  const [bgColor, setBgColor] = useState(colors[0]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const sectionHeight = window.innerHeight;

    // Calculate the background color based on the scroll position
    const sectionIndex = Math.floor(scrollTop / sectionHeight);
    const sectionProgress = (scrollTop % sectionHeight) / sectionHeight;
    const startColor = colors[sectionIndex];
    const endColor = colors[sectionIndex + 1] || colors[sectionIndex];
    const interpolatedColor = interpolateColor(
      startColor,
      endColor,
      sectionProgress
    );
    setBgColor(interpolatedColor);
  }, [colors]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const interpolateColor = (color1, color2, factor) => {
    const result = color1
      .slice(1)
      .match(/.{2}/g)
      .map((hex, index) => {
        const value1 = parseInt(hex, 16);
        const value2 = parseInt(color2.slice(1).match(/.{2}/g)[index], 16);
        const value = Math.round(value1 + (value2 - value1) * factor).toString(
          16
        );
        return value.padStart(2, '0');
      });
    return `#${result.join('')}`;
  };

  return (
    <motion.div
      className="relative"
      style={{ background: bgColor, transition: 'background-color 0.5s ease' }}
    >
      <div className="text-center flex flex-col gap-8 justify-center items-center py-8">
        <h1 className="text-4xl lg:text-8xl font-bold text-[#C16855]">
          Welcome to Clickapea!
        </h1>
        <p className="text-4xl text-[#C16855] pb-10">
          Your ultimate sous chef bestie
        </p>
        <div className="text-center text-xl px-10 lg:px-30 lg:w-2/3 tracking-tight">
          <div>
            Whether you're a seasoned chef or just starting, Clickapea helps you
            manage recipes, convert ingredients, follow step-by-step
            instructions, and create organized shopping lists, digitize your
            collection! Join us and make your cooking experience seamless and
            enjoyable.
          </div>
        </div>
      </div>

      {features.map((feature, index) => (
        <Section key={index} feature={feature} />
      ))}
    </motion.div>
  );
};

const Section = ({ feature }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const enterFromRight = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { duration: 0.8, ease: [0.42, 0.3, 0.58, 1] },
    },
    exit: {
      x: '100%',
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const enterFromLeft = {
    hidden: { x: '-100%', y: '0%' },
    visible: {
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
    exit: {
      x: '-100%',
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <motion.div
      className="flex flex-col w-full h-[48rem] justify-start items-center pt-20 px-8 lg:px-10 overflow-x-hidden"
      ref={ref}
      initial="hidden"
      animate={controls}
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.8 }}
    >
      <motion.h3
        className="text-3xl md:text-4xl lg:text-6xl font-semibold mb-4 text-[#C16855] text-center"
        variants={variants}
      >
        {feature.title}
      </motion.h3>
      <div className="flex flex-col lg:flex-row justify-center items-center">
        <motion.div
          className="w-full lg:w-5/12 text-right"
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={enterFromLeft}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="object-cover w-full h-full lg:h-[34rem] lg:w-[34rem]"
          />
        </motion.div>

        <motion.div
          className="feature-content w-full lg:w-7/12 lg:pl-2 text-center lg:text-left text-2xl md:text-3xl lg:text-4xl tracking-tight"
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={enterFromRight}
        >
          <p className="text-gray-600 lg:w-2/3 lg:pl-10">
            {feature.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const features = [
  {
    title: 'Recipe Management',
    description:
      'Organize and store all your favorite recipes in one place. Our easy-to-use interface allows you to quickly add, edit, and search for recipes.',
    image: '/assets/images/homepage/manage.png',
  },
  {
    title: 'Ingredient Conversion',
    description:
      'Effortlessly convert ingredients between metric and imperial units. Clickapea takes the guesswork out of measurements.',
    image: '/assets/images/homepage/convert.png',
  },
  {
    title: 'Interactive Instructions',
    description:
      'Follow step-by-step cooking instructions with ease. Our interactive guide ensures you never miss a step.',
    image: '/assets/images/homepage/interact.png',
  },
  {
    title: 'Shopping List',
    description:
      'Create and manage your shopping list directly from your recipes. Clickapea helps you stay organized and prepared.',
    image: '/assets/images/homepage/shop.png',
  },
  {
    title: 'Save Recipes',
    description:
      'Easily save recipes from all over the internet with just a web address. Clickapea fetches and processes all the details for you.',
    image: '/assets/images/homepage/save.png',
  },
  {
    title: 'Nutritional Information',
    description:
      'Get detailed nutritional information for all your recipes. Clickapea helps you make informed decisions about your meals.',
    image: '/assets/images/homepage/nutrition.png',
  },
];

export default HomePage;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';
import './HomePage.css';

const HomePage = () => {
  const colors = [
    '#FFFFFF',
    '#FF6347', // Tomato for 'Recipe Management'
    '#FFD700', // Gold for 'Ingredient Conversion'
    '#ADFF2F', // GreenYellow for 'Interactive Instructions'
    '#20B2AA', // LightSeaGreen for 'Shopping List'
    '#F5F5DC', // Beige for 'Save Recipes'
    '#E0FFFF', // LightCyan for 'Nutritional Information'
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [bgColor, setBgColor] = useState(colors[0]);
  const formRef = useRef(null);
  const initialFormTop = useRef(null); // To store the initial top position of the form
  const [formSticky, setFormSticky] = useState(false);
  const [breakpoints, setBreakpoints] = useState({
    isXSmall: window.innerWidth <= 400,
    isSmall: window.innerWidth > 400 && window.innerWidth <= 768,
    isMedium: window.innerWidth > 768 && window.innerWidth <= 1024,
    isLarge: window.innerWidth > 1024 && window.innerWidth <= 1280,
    isXLarge: window.innerWidth > 1280,
  });

  const handleResize = useCallback(() => {
    setBreakpoints({
      isXSmall: window.innerWidth <= 400,
      isSmall: window.innerWidth > 400 && window.innerWidth <= 768,
      isMedium: window.innerWidth > 768 && window.innerWidth <= 1024,
      isLarge: window.innerWidth > 1024 && window.innerWidth <= 1280,
      isXLarge: window.innerWidth > 1280,
    });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const sectionHeight = window.innerHeight;
    const totalSections = colors.length;
    const scrollProgress = scrollTop / (sectionHeight * (totalSections - 1));
    setScrollProgress(scrollProgress);

    if (initialFormTop.current === null) {
      initialFormTop.current = formRef.current.offsetTop;
    }

    const formTop = formRef.current.getBoundingClientRect().top;

    if (formTop <= 150) {
      setFormSticky(true);
    } else if (scrollTop <= initialFormTop.current - 150) {
      setFormSticky(false);
    }

    if (scrollTop === 0) {
      // Reset to initial state when scrolled to the top
      setFormSticky(false);
    }

    // Update current section based on scroll position
    const sectionIndex = Math.floor(scrollTop / sectionHeight);
    setCurrentSection(sectionIndex);

    // Calculate the background color based on the scroll position
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
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

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
      <div className="text-center py-8">
        <h1 className="text-4xl lg:text-6xl font-bold text-orange-800">
          Welcome to Clickapea!
        </h1>
        <p className="text-xl text-orange-600 pb-10 lg:pb-0">
          Your ultimate sous chef bestie
        </p>
        <div
          className={`${formSticky ? 'form-sticky z-10' : 'initial-form-position p-6'} transition-all flex justify-center`}
          ref={formRef}
        >
          <div className="w-11/12 lg:w-2/3 mt-[-30px] lg:mt-0">
            <AddRecipeForm />
          </div>
        </div>
        <div className="text-center text-xl flex flex-col gap-4 w-full px-10 lg:px-30 tracking-tight">
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
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const enterFromRight = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
    exit: {
      x: '100%',
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const enterFromLeft = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } },
    exit: {
      x: '-100%',
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <motion.div
      className="flex flex-col w-full justify-center items-center px-8 lg:px-10 pb-10"
      ref={ref}
      initial="hidden"
      animate={controls}
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.8 }}
    >
      <motion.h3
        className="text-3xl md:text-4xl lg:text-6xl font-semibold mb-4 text-orange-800"
        variants={variants}
      >
        {feature.title}
      </motion.h3>
      <div className="flex flex-row justify-center items-center">
        <motion.div
          className="w-5/12 text-right"
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={enterFromLeft}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.div
          className="feature-content w-7/12 pl-2 text-left text-2xl md:text-3xl lg:text-4xl tracking-tight"
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={enterFromRight}
        >
          <p className="text-gray-600">{feature.description}</p>
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

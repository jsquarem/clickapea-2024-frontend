import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AddRecipeForm from '../../components/AddRecipeForm/AddRecipeForm';
import {
  Animator,
  ScrollContainer,
  ScrollPage,
  Move,
  batch,
} from 'react-scroll-motion';
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
  const formRef = useRef(null);
  const initialFormTop = useRef(null); // To store the initial top position of the form
  const [formSticky, setFormSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sectionsRefs = useRef([]);
  const [currentSection, setCurrentSection] = useState(0);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(scrollTop / scrollHeight);

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
    const currentIndex = sectionsRefs.current.findIndex(
      (section) =>
        section.current.getBoundingClientRect().top >= 0 &&
        section.current.getBoundingClientRect().top < window.innerHeight / 2
    );
    setCurrentSection(
      currentIndex >= 0 ? currentIndex : sectionsRefs.current.length - 1
    );
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentSection]);

  return (
    <div className="relative">
      <div className="text-center py-8 bg-white">
        <h1 className="text-4xl lg:text-6xl font-bold text-orange-800">
          Welcome to Clickapea!
        </h1>
        <p className="text-xl text-orange-600 pb-10 lg:pb-0">
          Your ultimate sous chef bestie
        </p>
        <div
          className={`${formSticky ? 'form-sticky z-10' : 'initial-form-position bg-white p-6'} transition-all flex justify-center`}
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

      <ScrollContainer>
        {features.map((feature, index) => (
          <ScrollPage key={index}>
            <div
              style={{
                height: isMobile ? '80vh' : '80vh',
                position: 'relative',
                zIndex: 1,
                marginTop: isMobile ? -125 : '-5vh',
              }}
              className="flex flex-col w-full justify-center items-center px-2 lg:px-10"
            >
              <Animator animation={batch(Move(0, 0, 0, 0))}>
                <h3 className="text-4xl lg:text-6xl font-semibold mb-4 text-orange-800">
                  {feature.title}
                </h3>
              </Animator>
              <div className="flex flex-row justify-center items-center">
                <div className="w-5/12 text-right">
                  <Animator
                    animation={
                      isMobile
                        ? batch(Move(-100, 0, -100, 100))
                        : batch(Move(-1000, 1000, -1000, -500))
                    }
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="object-cover w-full h-full"
                    />
                  </Animator>
                </div>

                <div className="feature-content w-7/12 pl-2 text-left text-3xl lg:text-4xl tracking-tight">
                  <Animator
                    animation={
                      isMobile
                        ? batch(Move(30, 100, 30, 0))
                        : batch(Move(1000, 0, 1000, 0))
                    }
                  >
                    <p className="text-gray-600">{feature.description}</p>
                  </Animator>
                </div>
              </div>
            </div>
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `linear-gradient(to bottom, ${colors[index]}, ${
                  colors[index + 1] || colors[index]
                })`,
                opacity: scrollProgress,
                transition: 'opacity 0.5s',
                zIndex: 0,
              }}
            ></div>
          </ScrollPage>
        ))}
      </ScrollContainer>

      <footer className="py-12 bg-orange-800 text-white text-center">
        <Link
          to="/signup"
          className="inline-block bg-yellow-500 text-white text-lg font-semibold py-3 px-6 rounded hover:bg-yellow-600 transition"
        >
          Join Clickapea Today!
        </Link>
      </footer>
    </div>
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
      'Easily save recipes from all over the internet with just a web address. Clickapea fetches and processes all the details for you, making it simple to keep all your favorite recipes in one place.',
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

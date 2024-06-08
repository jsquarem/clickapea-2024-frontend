import React, { useEffect, useContext } from 'react';
import Loading from './components/Loading/Loading';
import { useLoading } from './LoadingContext';

const withLoading = (Component) => {
  return function WrappedComponent(props) {
    const { loading, setLoading } = useLoading();

    useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000);

      return () => clearTimeout(timer);
    }, [setLoading]);

    if (loading) {
      return (
        <div className="min-h-[40vh] lg:min-h-[61vh]">
          <Loading />
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default withLoading;

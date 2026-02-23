import Container from '../layout/Container';

const SectionWithBackground = ({
  images,
  overlay = "bg-black/30",
  children,
  className = '',
}) => {
  return (
    <section className={['relative overflow-hidden h-[400px]', className].join(' ')}>
      <div className="absolute inset-0 -z-10">
       <picture>
          {images?.desktop && (
            <source media="(min-width: 900px)" srcSet={images.desktop} />
          )}
          {images?.tablet && (
            <source media="(min-width: 640px)" srcSet={images.tablet} />
          )}
          <img
            src={images?.mobile}
            alt=""
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
        </picture>
        <div className={`absolute inset-0 ${overlay}`} />
      </div>

      <Container> {children} </Container>
    </section>
  );
};

export default SectionWithBackground;

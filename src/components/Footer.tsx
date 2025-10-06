'use client';

import { Box, Container, Flex, Text, Link, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Footer(): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(progress > 65); // Show animations when 65% scrolled
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation values that change as you scroll
  const bannerScale = 0.85 + (scrollProgress / 100) * 0.15;
  const bannerRotate = (100 - scrollProgress) * 0.05;
  const textOpacity = Math.min(scrollProgress / 75, 1);
  const waveOffset = scrollProgress * 1.5;

  return (
    <>
      <style jsx global>{`
        @keyframes smoothFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes gentlePulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes smoothShimmer {
          0% { background-position: -1200px 0; }
          100% { background-position: 1200px 0; }
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <Box
        as="footer"
        mt="auto"
        py={{ base: '12', md: '16' }}
        position="relative"
        overflow="hidden"
        bg="linear-gradient(180deg, #ffffff 0%, #f5f9fd 50%, #edf5fc 100%)"
      >
        {/* Background wave effects that pulse and move */}
        <Box
          position="absolute"
          top="-25%"
          left={`${-20 + waveOffset * 0.2}%`}
          w="65%"
          h="65%"
          bg="radial-gradient(circle, rgba(93, 159, 210, 0.18) 0%, transparent 70%)"
          borderRadius="50%"
          transition="left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          css={{
            animation: 'gentlePulse 10s ease-in-out infinite',
          }}
        />
        <Box
          position="absolute"
          bottom="-35%"
          right={`${-15 - waveOffset * 0.15}%`}
          w="75%"
          h="75%"
          bg="radial-gradient(circle, rgba(46, 94, 168, 0.15) 0%, transparent 70%)"
          borderRadius="50%"
          transition="right 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          css={{
            animation: 'gentlePulse 12s ease-in-out infinite 3s',
          }}
        />

        {/* Little floating dots for extra flair */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            top={`${15 + i * 14}%`}
            left={`${8 + i * 18}%`}
            w={i % 2 === 0 ? '5px' : '3px'}
            h={i % 2 === 0 ? '5px' : '3px'}
            bg={i % 2 === 0 ? '#5d9fd2' : '#2e5ea8'}
            borderRadius="50%"
            opacity={isVisible ? 0.35 : 0}
            transition="opacity 1s cubic-bezier(0.4, 0, 0.2, 1)"
            css={{
              animation: isVisible ? `smoothFloat ${3.5 + i * 0.4}s ease-in-out infinite ${i * 0.25}s` : 'none',
            }}
          />
        ))}

        <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto" position="relative" zIndex="1">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            gap={{ base: '8', md: '12' }}
          >
            {/* LiGHT Lab banner with animations */}
            <Box
              flex={{ base: '0 0 auto', md: '0 0 400px' }}
              w={{ base: '100%', sm: '400px' }}
              maxW="100%"
              position="relative"
            >
              {/* Shimmer effect around the banner */}
              <Box
                position="absolute"
                top="-12px"
                left="-12px"
                right="-12px"
                bottom="-12px"
                borderRadius="20px"
                opacity={isVisible ? 0.25 : 0}
                transition="opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
                background="linear-gradient(90deg, transparent, rgba(93, 159, 210, 0.35), transparent)"
                backgroundSize="1200px 100%"
                css={{
                  animation: isVisible ? 'smoothShimmer 4s linear infinite' : 'none',
                }}
              />

              <Link
                href="https://www.light-laboratory.org/"
                target="_blank"
                rel="noopener noreferrer"
                display="block"
                transform={`scale(${bannerScale}) rotate(${bannerRotate}deg)`}
                transition="transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                style={{
                  transformOrigin: 'center',
                }}
                cursor="pointer"
              >
                <Image
                  src="/light-banner.png"
                  alt="LiGHT Laboratory"
                  w="100%"
                  h="auto"
                  objectFit="contain"
                  opacity={isVisible ? 1 : 0.75}
                  transition="all 1s cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="16px"
                  boxShadow={isVisible ? '0 20px 60px rgba(46, 94, 168, 0.25)' : '0 10px 30px rgba(46, 94, 168, 0.12)'}
                  _hover={{
                    transform: 'scale(1.03)',
                    boxShadow: '0 25px 80px rgba(46, 94, 168, 0.35)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </Link>

              {/* Decorative circles in the corners */}
              <Box
                position="absolute"
                top="-10px"
                right="-10px"
                w="35px"
                h="35px"
                border="3px solid"
                borderColor="#2e5ea8"
                borderRadius="50%"
                opacity={isVisible ? 0.8 : 0}
                css={{
                  animation: isVisible ? 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both, smoothFloat 4s ease-in-out infinite 1s' : 'none',
                }}
              />
              <Box
                position="absolute"
                bottom="-10px"
                left="-10px"
                w="45px"
                h="45px"
                border="3px solid"
                borderColor="#5d9fd2"
                borderRadius="50%"
                opacity={isVisible ? 0.7 : 0}
                css={{
                  animation: isVisible ? 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s both, smoothFloat 5s ease-in-out infinite 1.5s' : 'none',
                }}
              />
            </Box>

            {/* Credits and links */}
            <Flex
              direction="column"
              align={{ base: 'center', md: 'flex-end' }}
              gap="4"
              textAlign={{ base: 'center', md: 'right' }}
              opacity={textOpacity}
              transition="opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Box
                css={{
                  animation: isVisible ? 'fadeSlideIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both' : 'none',
                }}
              >
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  bgGradient="linear-gradient(135deg, #5d9fd2 0%, #2e5ea8 100%)"
                  bgClip="text"
                  mb="2"
                >
                  LiGHT Laboratory
                </Text>
                <Text fontSize="sm" color="gray.600" maxW="400px">
                  Made with ❤️ by{' '}
                  <Link
                    href="https://github.com/AZOGOAT"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="#2e5ea8"
                    fontWeight="600"
                    position="relative"
                    transition="color 0.3s ease"
                    _hover={{
                      color: '#5d9fd2',
                      _after: {
                        width: '100%',
                      }
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: 0,
                      height: '2px',
                      bg: '#5d9fd2',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    AZO
                  </Link>
                  {' '}from the{' '}
                  <Link
                    href="https://github.com/EPFLiGHT"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="#2e5ea8"
                    fontWeight="600"
                    position="relative"
                    transition="color 0.3s ease"
                    _hover={{
                      color: '#5d9fd2',
                      _after: {
                        width: '100%',
                      }
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: 0,
                      height: '2px',
                      bg: '#5d9fd2',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    LiGHT Lab
                  </Link>
                </Text>
              </Box>

              <Box
                css={{
                  animation: isVisible ? 'fadeSlideIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both' : 'none',
                }}
              >
                <Text fontSize="sm" color="gray.600">
                  Contribute on{' '}
                  <Link
                    href="https://github.com/EPFLiGHT/Conferences-Calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="#2e5ea8"
                    fontWeight="600"
                    position="relative"
                    transition="color 0.3s ease"
                    _hover={{
                      color: '#5d9fd2',
                      _after: {
                        width: '100%',
                      }
                    }}
                    _after={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: 0,
                      height: '2px',
                      bg: '#5d9fd2',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    GitHub
                  </Link>
                </Text>
              </Box>

              {/* Nice gradient divider line */}
              <Box
                w={isVisible ? '140px' : '0px'}
                h="3px"
                bg="linear-gradient(90deg, #5d9fd2, #2e5ea8)"
                borderRadius="full"
                transition="width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s"
              />
            </Flex>
          </Flex>
        </Container>

        {/* Gradient line at the very bottom */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          h="2px"
          bg="linear-gradient(90deg, transparent, #5d9fd2, #2e5ea8, #5d9fd2, transparent)"
          opacity={isVisible ? 1 : 0}
          transition="opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
        />
      </Box>
    </>
  );
}

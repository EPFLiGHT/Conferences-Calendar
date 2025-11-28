'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Box, Container, Flex, HStack, Link, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Home, Calendar, Users } from 'lucide-react';
import { GRADIENTS, brandAlpha } from '@/theme';

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="100"
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor="brand.200"
      boxShadow={`0 2px 16px ${brandAlpha(500, 0.08)}`}
    >
      {/* Scroll Progress Bar */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="4px"
        bg={brandAlpha(500, 0.1)}
        zIndex="101"
      >
        <Box
          className="progress-bar"
          h="100%"
          w={`${scrollProgress}%`}
          bg={GRADIENTS.headerProgress}
          transition="width 0.1s linear"
          boxShadow={`0 0 16px ${brandAlpha(500, 0.8)}, 0 0 8px ${brandAlpha(400, 0.6)}`}
          borderRadius="0 4px 4px 0"
          style={{ willChange: 'width' }}
        />
      </Box>
      <style jsx global>{`
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
        <Flex align="center" justify="space-between" py="5" gap={{ base: '2', md: '8' }}>
          {/* Logo and Brand */}
          <Flex align="center" gap={{ base: '2', md: '6' }} flex="1">
            <Link
              as="a"
              href="https://www.light-laboratory.org/"
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              gap="4"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              <Image
                src="/light-logo.svg"
                alt="LiGHT Lab"
                h={{ base: '40px', md: '60px' }}
                w="auto"
                maxW={{ base: '100px', md: 'none' }}
                objectFit="contain"
                _hover={{ filter: `drop-shadow(0 4px 8px ${brandAlpha(500, 0.3)})` }}
              />
              <Box display={{ base: 'none', lg: 'block' }}>
                <Text fontSize="sm" fontWeight="600" color="brand.500" lineHeight="1.3">
                  Laboratory for Intelligent
                </Text>
                <Text fontSize="sm" fontWeight="600" color="brand.400" lineHeight="1.3">
                  Global Health & Humanitarian
                </Text>
                <Text fontSize="sm" fontWeight="600" color="brand.400" lineHeight="1.3">
                  Response Technologies
                </Text>
              </Box>
            </Link>

            <Box
              w="2px"
              h="65px"
              bgGradient="to-b"
              gradientFrom="transparent"
              gradientVia="brand.500"
              gradientTo="transparent"
              opacity="0.3"
              display={{ base: 'none', md: 'block' }}
            />

            <Box>
              <Text
                fontSize="xl"
                fontWeight="700"
                bgGradient="to-r"
                gradientFrom="brand.500"
                gradientTo="brand.400"
                bgClip="text"
                lineHeight="1.2"
              >
                Conference Deadlines
              </Text>
              <Text fontSize="sm" color="gray.600">
                Track research conferences & deadlines
              </Text>
            </Box>
          </Flex>

          {/* Navigation */}
          <HStack gap={{ base: '1.5', sm: '3' }}>
            {[
              { href: '/', label: 'Home', Icon: Home },
              { href: '/calendar', label: 'Calendar', Icon: Calendar },
              { href: '/speakers', label: 'Speakers', Icon: Users },
            ].map(({ href, label, Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  as={NextLink}
                  href={href}
                  px={{ base: '3', sm: '5' }}
                  py={{ base: '2', sm: '2.5' }}
                  borderRadius="10px"
                  fontWeight="600"
                  fontSize="sm"
                  color={isActive ? 'white' : 'gray.600'}
                  bg={isActive ? 'brand.500' : 'transparent'}
                  border="2px solid"
                  borderColor={isActive ? 'brand.600' : 'transparent'}
                  transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  boxShadow={isActive ? `0 4px 12px ${brandAlpha(500, 0.3)}` : 'none'}
                  _hover={{
                    color: isActive ? 'white' : 'brand.500',
                    bg: isActive ? 'brand.600' : 'brand.50',
                    borderColor: isActive ? 'brand.600' : 'brand.200',
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: isActive
                      ? `0 8px 20px ${brandAlpha(500, 0.4)}`
                      : `0 6px 16px ${brandAlpha(500, 0.2)}`,
                  }}
                  _active={{
                    transform: 'scale(0.95)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <Flex align="center" gap="2">
                    <Icon size={18} strokeWidth={2.5} />
                    <Text as="span" display={{ base: 'none', sm: 'inline' }}>{label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

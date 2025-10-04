'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Box, Container, Flex, HStack, Link, Text, Image } from '@chakra-ui/react';

export default function Header(): JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="100"
      bg="rgba(255, 255, 255, 0.95)"
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor="brand.200"
      boxShadow="0 2px 16px rgba(46, 95, 169, 0.08)"
    >
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
              _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
            >
              <Image
                src={`${process.env.NODE_ENV === 'production' ? '/Conferences-Calendar' : ''}/light-logo.svg`}
                alt="LiGHT Lab"
                h={{ base: '40px', md: '60px' }}
                w="auto"
                maxW={{ base: '100px', md: 'none' }}
                objectFit="contain"
                transition="all 0.3s"
                _hover={{ filter: 'drop-shadow(0 4px 8px rgba(46, 95, 169, 0.3))' }}
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
          <HStack gap="3">
            <Link
              as={NextLink}
              href="/"
              px="5"
              py="2.5"
              borderRadius="10px"
              fontWeight="600"
              fontSize="sm"
              color={pathname === '/' ? 'white' : 'gray.600'}
              bg={pathname === '/' ? 'brand.500' : 'transparent'}
              border="2px solid"
              borderColor={pathname === '/' ? 'brand.600' : 'transparent'}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                color: pathname === '/' ? 'white' : 'brand.500',
                bg: pathname === '/' ? 'brand.600' : 'brand.50',
                borderColor: pathname === '/' ? 'brand.600' : 'brand.200',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              boxShadow={pathname === '/' ? '0 4px 12px rgba(46, 95, 169, 0.3)' : 'none'}
            >
              🏠 <Text as="span" display={{ base: 'none', sm: 'inline' }} ml="2">Home</Text>
            </Link>
            <Link
              as={NextLink}
              href="/calendar"
              px="5"
              py="2.5"
              borderRadius="10px"
              fontWeight="600"
              fontSize="sm"
              color={pathname === '/calendar' ? 'white' : 'gray.600'}
              bg={pathname === '/calendar' ? 'brand.500' : 'transparent'}
              border="2px solid"
              borderColor={pathname === '/calendar' ? 'brand.600' : 'transparent'}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                color: pathname === '/calendar' ? 'white' : 'brand.500',
                bg: pathname === '/calendar' ? 'brand.600' : 'brand.50',
                borderColor: pathname === '/calendar' ? 'brand.600' : 'brand.200',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              boxShadow={pathname === '/calendar' ? '0 4px 12px rgba(46, 95, 169, 0.3)' : 'none'}
            >
              📅 <Text as="span" display={{ base: 'none', sm: 'inline' }} ml="2">Calendar</Text>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

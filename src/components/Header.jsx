import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, Flex, HStack, Link, Text, Image } from '@chakra-ui/react';

export default function Header() {
  const location = useLocation();

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
        <Flex align="center" justify="space-between" py="5" gap="8">
          {/* Logo and Brand */}
          <Flex align="center" gap="6" flex="1">
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
                src={`${import.meta.env.BASE_URL}light-logo.svg`}
                alt="LiGHT Lab"
                h="75px"
                w="auto"
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
              as={RouterLink}
              to="/"
              px="5"
              py="2.5"
              borderRadius="10px"
              fontWeight="600"
              fontSize="sm"
              color={location.pathname === '/' ? 'white' : 'gray.600'}
              bg={location.pathname === '/' ? 'brand.500' : 'transparent'}
              border="2px solid"
              borderColor={location.pathname === '/' ? 'brand.600' : 'transparent'}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                color: location.pathname === '/' ? 'white' : 'brand.500',
                bg: location.pathname === '/' ? 'brand.600' : 'brand.50',
                borderColor: location.pathname === '/' ? 'brand.600' : 'brand.200',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              boxShadow={location.pathname === '/' ? '0 4px 12px rgba(46, 95, 169, 0.3)' : 'none'}
            >
              🏠 <Text as="span" display={{ base: 'none', sm: 'inline' }} ml="2">Home</Text>
            </Link>
            <Link
              as={RouterLink}
              to="/calendar"
              px="5"
              py="2.5"
              borderRadius="10px"
              fontWeight="600"
              fontSize="sm"
              color={location.pathname === '/calendar' ? 'white' : 'gray.600'}
              bg={location.pathname === '/calendar' ? 'brand.500' : 'transparent'}
              border="2px solid"
              borderColor={location.pathname === '/calendar' ? 'brand.600' : 'transparent'}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                color: location.pathname === '/calendar' ? 'white' : 'brand.500',
                bg: location.pathname === '/calendar' ? 'brand.600' : 'brand.50',
                borderColor: location.pathname === '/calendar' ? 'brand.600' : 'brand.200',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
              boxShadow={location.pathname === '/calendar' ? '0 4px 12px rgba(46, 95, 169, 0.3)' : 'none'}
            >
              📅 <Text as="span" display={{ base: 'none', sm: 'inline' }} ml="2">Calendar</Text>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

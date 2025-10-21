'use client';

import { Box, Container, Flex, Text, Heading, Grid, Image, Link as ChakraLink } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { COLORS, SHADOWS, brandAlpha } from '@/theme';

/**
 * Slack Bot Installation Landing Page
 * Displays an "Add to Slack" button for OAuth installation
 */
export default function SlackInstallPage() {
  // Get the base URL from environment
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://conferences-calendar.vercel.app');

  return (
    <>
      <Header />
      <Box py={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
        <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
          {/* Hero Section */}
          <Box textAlign="center" mb="16">
            {/* Animated Icon */}
            <Flex justify="center" mb="8">
              <Box
                fontSize="8xl"
                lineHeight="1"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
              >
                📅
              </Box>
            </Flex>

            {/* Title with Gradient */}
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="800"
              mb="6"
              bgGradient="to-r"
              gradientFrom="brand.600"
              gradientTo="brand.400"
              bgClip="text"
              lineHeight="1.2"
            >
              Conferences Calendar Bot
            </Heading>

            {/* Subtitle */}
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              color="gray.700"
              fontWeight="600"
              mb="4"
            >
              Never miss an important conference deadline!
            </Text>

            {/* Description */}
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              maxW="3xl"
              mx="auto"
              mb="10"
            >
              Get smart reminders for upcoming deadlines, search conferences by topic,
              and customize notifications for your research areas.
            </Text>

            {/* Add to Slack Button */}
            <Flex justify="center" mb="4">
              <ChakraLink
                href={`${appUrl}/api/slack/install`}
                display="inline-block"
                transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                _hover={{
                  transform: 'translateY(-2px) scale(1.05)',
                  filter: 'drop-shadow(0 8px 16px rgba(46, 95, 169, 0.3))',
                }}
                _active={{
                  transform: 'scale(0.98)',
                }}
              >
                <Image
                  src="https://platform.slack-edge.com/img/add_to_slack.png"
                  srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                  alt="Add to Slack"
                  h="48px"
                  w="auto"
                />
              </ChakraLink>
            </Flex>

            <Text fontSize="sm" color="gray.500">
              Free for all Slack workspaces
            </Text>
          </Box>

          {/* Features Grid */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap="6"
            mb="16"
          >
            {[
              {
                icon: '🔔',
                title: 'Smart Notifications',
                description: 'Get reminders 30, 7, and 3 days before deadlines',
                gradient: `linear-gradient(135deg, ${COLORS.brand[50]} 0%, ${COLORS.brand[100]} 100%)`,
              },
              {
                icon: '🔍',
                title: 'Quick Search',
                description: 'Search conferences by name or subject area',
                gradient: `linear-gradient(135deg, ${brandAlpha(400, 0.1)} 0%, ${brandAlpha(300, 0.15)} 100%)`,
              },
              {
                icon: '⚙️',
                title: 'Customizable',
                description: 'Filter by subjects (ML, CV, NLP, Security, etc.)',
                gradient: `linear-gradient(135deg, ${COLORS.brand[100]} 0%, ${COLORS.brand[50]} 100%)`,
              },
            ].map((feature, index) => (
              <Box
                key={index}
                p="8"
                bg={feature.gradient}
                borderRadius="16px"
                border="1px solid"
                borderColor="brand.200"
                boxShadow={SHADOWS.md}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: SHADOWS.xl,
                  borderColor: 'brand.300',
                }}
              >
                <Text fontSize="5xl" mb="4">{feature.icon}</Text>
                <Heading
                  as="h3"
                  fontSize="xl"
                  fontWeight="700"
                  color="gray.800"
                  mb="3"
                >
                  {feature.title}
                </Heading>
                <Text fontSize="md" color="gray.600" lineHeight="1.6">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* Commands Section */}
          <Box
            p={{ base: '8', md: '10' }}
            bg="white"
            borderRadius="20px"
            border="2px solid"
            borderColor="brand.200"
            boxShadow={`0 8px 24px ${brandAlpha(500, 0.12)}`}
          >
            <Heading
              as="h2"
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="700"
              color="gray.800"
              mb="6"
              textAlign="center"
            >
              Available Commands
            </Heading>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap="4"
            >
              {[
                { cmd: '/conf-upcoming', desc: 'Show next deadlines', color: 'brand.500' },
                { cmd: '/conf-search', desc: 'Search conferences', color: 'brand.400' },
                { cmd: '/conf-subscribe', desc: 'Enable notifications', color: 'brand.600' },
                { cmd: '/conf-help', desc: 'See all commands', color: 'brand.500' },
              ].map((command, index) => (
                <Flex
                  key={index}
                  align="center"
                  gap="4"
                  p="4"
                  bg={brandAlpha(500, 0.05)}
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="brand.100"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: brandAlpha(500, 0.1),
                    borderColor: 'brand.200',
                    transform: 'translateX(4px)',
                  }}
                >
                  <Box
                    as="code"
                    px="4"
                    py="2"
                    bg="white"
                    borderRadius="8px"
                    fontFamily="mono"
                    fontSize="sm"
                    fontWeight="600"
                    color={command.color}
                    boxShadow="sm"
                    whiteSpace="nowrap"
                  >
                    {command.cmd}
                  </Box>
                  <Text fontSize="sm" color="gray.600" flex="1">
                    {command.desc}
                  </Text>
                </Flex>
              ))}
            </Grid>
          </Box>

          {/* Footer Section */}
          <Box mt="16" pt="8" borderTop="2px solid" borderColor="brand.100" textAlign="center">
            <Text fontSize="md" color="gray.600" mb="2">
              Built with ❤️ for academic researchers and conference attendees
            </Text>
            <Text fontSize="sm" color="gray.500">
              LiGHT Laboratory • EPFL
            </Text>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

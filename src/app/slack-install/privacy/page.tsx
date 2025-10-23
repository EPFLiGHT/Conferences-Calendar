'use client';

import { Box, Container, Text, Heading, VStack, Link as ChakraLink } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { brandAlpha } from '@/theme';
import Link from 'next/link';

/**
 * Privacy Policy Page for Slack Bot
 * Explains data collection, usage, and user rights
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Box py={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
        <Container maxW="900px" px={{ base: '4', md: '6' }} mx="auto">
          {/* Back Link */}
          <Box mb="6">
            <ChakraLink
              as={Link}
              href="/slack-install"
              color="brand.600"
              fontWeight="600"
              _hover={{ color: 'brand.700', textDecoration: 'underline' }}
            >
              ← Back to Slack Installation
            </ChakraLink>
          </Box>

          {/* Title */}
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="800"
            mb="4"
            bgGradient="to-r"
            gradientFrom="brand.600"
            gradientTo="brand.400"
            bgClip="text"
            lineHeight="1.3"
            pb="1"
          >
            Privacy Policy
          </Heading>

          <Text fontSize="md" color="gray.600" mb="10">
            Last Updated: October 23, 2025
          </Text>

          {/* Content */}
          <VStack align="stretch" gap="8">
            {/* Introduction */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Introduction
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                The Conferences Calendar Bot ("the Bot") is operated by LiGHT Laboratory. This Privacy Policy
                explains how we collect, use, and protect your information when you use our Slack bot to receive
                conference deadline notifications and search academic conferences.
              </Text>
            </Box>

            {/* Information We Collect */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Information We Collect
              </Heading>
              <Box
                p="6"
                bg={brandAlpha(500, 0.05)}
                borderRadius="12px"
                border="1px solid"
                borderColor="brand.100"
              >
                <VStack align="stretch" gap="4">
                  <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="600" color="gray.800" mb="2">
                      1. Slack Workspace Information
                    </Heading>
                    <Text fontSize="md" color="gray.700" lineHeight="1.8">
                      • Slack user ID (for identifying your preferences)
                      <br />
                      • Slack team/workspace ID (for multi-workspace support)
                      <br />
                      • User timezone (for accurate deadline notifications)
                      <br />
                      • Email address (optional, for unique identification across sessions)
                    </Text>
                  </Box>

                  <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="600" color="gray.800" mb="2">
                      2. User Preferences
                    </Heading>
                    <Text fontSize="md" color="gray.700" lineHeight="1.8">
                      • Notification subscription status (enabled/disabled)
                      <br />
                      • Selected reminder days (e.g., 30, 7, 3 days before deadlines)
                      <br />
                      • Subject area preferences (e.g., ML, CV, NLP, Security)
                      <br />
                      • Last notification timestamp
                    </Text>
                  </Box>

                  <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="600" color="gray.800" mb="2">
                      3. Channel Subscriptions
                    </Heading>
                    <Text fontSize="md" color="gray.700" lineHeight="1.8">
                      • Channel IDs and names where the bot is installed
                      <br />
                      • Channel subscription preferences
                      <br />
                      • Last posted timestamps
                    </Text>
                  </Box>

                  <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="600" color="gray.800" mb="2">
                      4. Usage Data
                    </Heading>
                    <Text fontSize="md" color="gray.700" lineHeight="1.8">
                      • Commands executed (for debugging and improvement)
                      <br />
                      • Error logs (without personal information)
                      <br />
                      • API request timestamps
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </Box>

            {/* How We Use Your Information */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                How We Use Your Information
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8" mb="3">
                We use the collected information to:
              </Text>
              <Box pl="4">
                <Text fontSize="md" color="gray.700" lineHeight="1.8">
                  • Send personalized conference deadline notifications based on your preferences
                  <br />
                  • Display deadlines in your local timezone
                  <br />
                  • Filter conferences by your selected subject areas
                  <br />
                  • Maintain your subscription and notification settings
                  <br />
                  • Post deadline reminders to subscribed channels
                  <br />
                  • Improve the bot's functionality and user experience
                  <br />
                  • Debug issues and ensure service reliability
                </Text>
              </Box>
            </Box>

            {/* Data Storage and Security */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Data Storage and Security
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                • All user preferences are stored securely in a Vercel KV (Redis) database with encryption at rest
                <br />
                • We use Slack's OAuth tokens securely stored as environment variables
                <br />
                • All communications with Slack API are encrypted via HTTPS
                <br />
                • Access to the database is restricted and authenticated
                <br />
                • We do not sell, trade, or share your personal information with third parties
              </Text>
            </Box>

            {/* Data Retention */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Data Retention
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                We retain your data as long as:
                <br />
                • Your workspace has the bot installed, OR
                <br />
                • You remain subscribed to notifications
                <br />
                <br />
                When you unsubscribe or uninstall the bot, your preferences are retained for 30 days
                in case you wish to resubscribe. After 30 days, your data may be permanently deleted.
              </Text>
            </Box>

            {/* Your Rights */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Your Rights
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                You have the right to:
                <br />
                • Access your stored preferences using the <Text as="code" bg="gray.100" px="2" py="1" borderRadius="4px">/conf settings</Text> command
                <br />
                • Modify your notification preferences at any time
                <br />
                • Unsubscribe from notifications using <Text as="code" bg="gray.100" px="2" py="1" borderRadius="4px">/conf unsubscribe</Text>
                <br />
                • Request deletion of your data by uninstalling the bot from your workspace
                <br />
                • Contact us to request a complete data export or deletion
              </Text>
            </Box>

            {/* Third-Party Services */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Third-Party Services
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                This bot uses the following third-party services:
                <br />
                • <strong>Slack API</strong>: For messaging and user authentication (governed by <ChakraLink href="https://slack.com/privacy-policy" target="_blank" rel="noopener noreferrer" color="brand.600" textDecoration="underline">Slack's Privacy Policy</ChakraLink>)
                <br />
                • <strong>Vercel</strong>: For hosting and database storage (governed by <ChakraLink href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" color="brand.600" textDecoration="underline">Vercel's Privacy Policy</ChakraLink>)
                <br />
                • <strong>GitHub Pages</strong>: For fetching public conference data (no personal data shared)
              </Text>
            </Box>

            {/* Conference Data */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Conference Data
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                The conference deadline information is sourced from a publicly maintained YAML file hosted
                on our website. This data contains no personal information and is freely accessible to anyone.
                We do not track which specific conferences you view or search for.
              </Text>
            </Box>

            {/* Changes to This Policy */}
            <Box>
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Changes to This Policy
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                We may update this Privacy Policy from time to time. The "Last Updated" date at the top
                indicates when the policy was last revised. Continued use of the bot after changes constitutes
                acceptance of the updated policy.
              </Text>
            </Box>

            {/* Contact Information */}
            <Box
              p="6"
              bg="gray.50"
              borderRadius="12px"
              border="1px solid"
              borderColor="gray.200"
            >
              <Heading as="h2" fontSize="2xl" fontWeight="700" color="gray.800" mb="4">
                Contact Us
              </Heading>
              <Text fontSize="md" color="gray.700" lineHeight="1.8">
                If you have questions or concerns about this Privacy Policy or how we handle your data,
                please contact us at:
                <br />
                <br />
                <strong>LiGHT Laboratory</strong>
                <br />
                Email: <ChakraLink href="mailto:omar.azgaoui@epfl.ch" color="brand.600" textDecoration="underline">omar.azgaoui@epfl.ch</ChakraLink>
                <br />
                GitHub: <ChakraLink href="https://github.com/EPFLiGHT/Conferences-Calendar" target="_blank" rel="noopener noreferrer" color="brand.600" textDecoration="underline">github.com/EPFLiGHT/Conferences-Calendar</ChakraLink>
              </Text>
            </Box>

            {/* Consent */}
            <Box
              p="6"
              bg={brandAlpha(500, 0.08)}
              borderRadius="12px"
              border="2px solid"
              borderColor="brand.200"
            >
              <Text fontSize="md" color="gray.800" fontWeight="600" lineHeight="1.8">
                By installing and using the Conferences Calendar Bot, you acknowledge that you have read
                and understood this Privacy Policy and consent to the collection, use, and storage of your
                information as described herein.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

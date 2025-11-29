'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, VStack, Badge } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Speaker, Presentation } from '@/types/speaker';
import { COLORS } from '@/theme';
import ExternalLinkButton from './ExternalLinkButton';
import SpeakerAvatar from './SpeakerAvatar';

const MotionBox = motion.create(Box);

interface SpeakerCardProps {
  speaker: Speaker;
  index?: number;
  onClick?: () => void;
}

const EVENT_TYPE_COLORS: Record<Presentation['eventType'], string> = {
  conference: '#9333EA',
  workshop: '#14B8A6',
  summit: '#F59E0B',
  seminar: COLORS.brand[500],
};

export default function SpeakerCard({ speaker, index = 0, onClick }: SpeakerCardProps): JSX.Element {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const animationDelay = isMobile ? (index % 12) * 0.03 : (index % 12) * 0.02;
  const animationDuration = isMobile ? 0.3 : 0.25;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPresentation = speaker.presentations[currentIndex];
  const hasMultiplePresentations = speaker.presentations.length > 1;

  // Auto-advance carousel for multiple presentations
  useEffect(() => {
    if (!hasMultiplePresentations) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === speaker.presentations.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [hasMultiplePresentations, speaker.presentations.length]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px", amount: 0.1 }}
      transition={{
        duration: animationDuration,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
        layout: { duration: 0.15, ease: 'easeOut' }
      }}
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="brand.200"
      boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
      p="6"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      whileHover={{
        boxShadow: '0 8px 24px rgba(46, 95, 169, 0.2)',
        y: -4,
        scale: 1.02,
        borderColor: 'var(--chakra-colors-brand-400)',
        transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      <VStack gap="4" align="stretch">
        {/* Speaker Avatar and Name */}
        <Flex align="center" gap="4">
          <SpeakerAvatar
            imageUrl={speaker.imageUrl}
            name={speaker.name}
            size="sm"
          />
          <VStack align="start" gap="1" flex="1">
            <Heading
              fontSize="lg"
              fontWeight="600"
              color="gray.900"
              lineHeight="1.3"
            >
              {speaker.name}
            </Heading>
            <Badge
              colorScheme="gray"
              fontSize="xs"
              px="2"
              py="0.5"
              borderRadius="md"
              textTransform="capitalize"
              bg={EVENT_TYPE_COLORS[currentPresentation.eventType]}
              color="white"
            >
              {currentPresentation.eventType}
            </Badge>
          </VStack>
        </Flex>

        {/* Presentation Content with Auto Carousel */}
        <Box position="relative">
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              bg="white"
              borderRadius="xl"
              p="4"
              border="1px"
              borderColor="brand.100"
              boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
            >
              {/* Topic */}
              <Box mb="3">
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                  mb="1"
                >
                  Topic
                </Text>
                <Text
                  fontSize="md"
                  color="gray.800"
                  lineHeight="1.5"
                  fontStyle="italic"
                >
                  &ldquo;{currentPresentation.topic}&rdquo;
                </Text>
              </Box>

              {/* Event */}
              <Box mb={currentPresentation.link ? "3" : "0"}>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                  mb="1"
                >
                  Event
                </Text>
                <Text
                  fontSize="md"
                  color="brand.600"
                  fontWeight="500"
                >
                  {currentPresentation.event}
                </Text>
              </Box>

              {/* Link if available */}
              {currentPresentation.link && (
                <Box
                  pt="3"
                  borderTop="1px"
                  borderColor="gray.100"
                >
                  <ExternalLinkButton
                    href={currentPresentation.link}
                    variant="secondary"
                    size="sm"
                  >
                    <Flex align="center" gap="2">
                      <ExternalLink size={16} />
                      <Text>View Presentation</Text>
                    </Flex>
                  </ExternalLinkButton>
                </Box>
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>
      </VStack>
    </MotionBox>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Badge,
  Portal,
} from '@chakra-ui/react';
import { X, ExternalLink } from 'lucide-react';
import { Speaker, Presentation } from '@/types/speaker';
import { COLORS } from '@/theme';
import ExternalLinkButton from './ExternalLinkButton';
import SpeakerAvatar from './SpeakerAvatar';

const EVENT_TYPE_COLORS: Record<Presentation['eventType'], { bg: string; color: string; border: string }> = {
  conference: {
    bg: '#f3e8ff',
    color: '#9333EA',
    border: '#d8b4fe',
  },
  workshop: {
    bg: '#ccfbf1',
    color: '#14B8A6',
    border: '#5eead4',
  },
  summit: {
    bg: '#fef3c7',
    color: '#F59E0B',
    border: '#fde68a',
  },
  seminar: {
    bg: COLORS.brand[50],
    color: COLORS.brand[600],
    border: COLORS.brand[200],
  },
};

interface SpeakerModalProps {
  speaker: Speaker;
  onClose: () => void;
}

export default function SpeakerModal({ speaker, onClose }: SpeakerModalProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(true);

  // Sort presentations by year (most recent first)
  const sortedPresentations = [...speaker.presentations].sort((a, b) => b.year - a.year);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.6)"
        backdropFilter="blur(8px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="modal"
        p="4"
        onClick={handleBackdropClick}
      >
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="0 20px 60px rgba(46, 95, 169, 0.3)"
          border="1px"
          borderColor="brand.200"
          overflow="hidden"
          maxW="800px"
          maxH="90vh"
          w="full"
          display="flex"
          flexDirection="column"
        >
          <Box
            bg={`linear-gradient(135deg, ${COLORS.brand[500]} 0%, ${COLORS.brand[600]} 100%)`}
            p="6"
            borderBottom="1px"
            borderColor="brand.300"
          >
            <Flex align="center" justify="space-between" gap="4">
              <Flex align="center" gap="4">
                <SpeakerAvatar
                  imageUrl={speaker.imageUrl}
                  name={speaker.name}
                  size="md"
                />
                <VStack align="start" gap="1">
                  <Heading
                    fontSize="2xl"
                    fontWeight="700"
                    color="white"
                    lineHeight="1.3"
                  >
                    {speaker.name}
                  </Heading>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="500">
                    {speaker.presentations.length} {speaker.presentations.length === 1 ? 'Presentation' : 'Presentations'}
                  </Text>
                </VStack>
              </Flex>
              <Button
                onClick={handleClose}
                p="2"
                minW="auto"
                h="auto"
                borderRadius="lg"
                bg="whiteAlpha.200"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.300',
                }}
                transition="all 0.2s"
              >
                <X size={20} />
              </Button>
            </Flex>
          </Box>

          <Box p="6" overflowY="auto" maxH="calc(90vh - 150px)">
            <VStack gap="5" align="stretch">
              {sortedPresentations.map((presentation, index) => (
                <Box
                  key={`${speaker.id}-presentation-${index}`}
                  p="5"
                  bg={index === 0 ? COLORS.brand[50] : 'white'}
                  borderRadius="xl"
                  border="2px"
                  borderColor={index === 0 ? COLORS.brand[300] : 'gray.200'}
                  boxShadow={index === 0 ? '0 4px 12px rgba(46, 95, 169, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.05)'}
                  position="relative"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: index === 0 ? COLORS.brand[400] : 'gray.300',
                    boxShadow: index === 0 ? '0 6px 16px rgba(46, 95, 169, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {index === 0 && (
                    <Badge
                      position="absolute"
                      top="3"
                      right="3"
                      px="3"
                      py="1"
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="600"
                      bg={COLORS.brand[500]}
                      color="white"
                    >
                      Most Recent
                    </Badge>
                  )}

                  <VStack gap="3" align="stretch">
                    <Flex align="center" gap="2" wrap="wrap">
                      <Badge
                        px="3"
                        py="1"
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="600"
                        bg={EVENT_TYPE_COLORS[presentation.eventType].bg}
                        color={EVENT_TYPE_COLORS[presentation.eventType].color}
                        border="1px"
                        borderColor={EVENT_TYPE_COLORS[presentation.eventType].border}
                        textTransform="capitalize"
                      >
                        {presentation.eventType}
                      </Badge>
                      <Text fontSize="sm" color="gray.500" fontWeight="500">
                        {presentation.year}
                      </Text>
                    </Flex>

                    <Box>
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
                        &ldquo;{presentation.topic}&rdquo;
                      </Text>
                    </Box>

                    <Box>
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
                        color={COLORS.brand[600]}
                        fontWeight="500"
                      >
                        {presentation.event}
                      </Text>
                    </Box>

                    {presentation.link && (
                      <Box pt="2">
                        <ExternalLinkButton
                          href={presentation.link}
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
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Portal,
} from '@chakra-ui/react';
import { X, Globe, FileText, Code, Calendar } from 'lucide-react';
import DeadlineCard from './DeadlineCard';
import ExternalLinkButton from './ExternalLinkButton';
import ConferenceDetails from './ConferenceDetails';
import { getDeadlineInfo } from '@/utils/parser';
import { exportConference } from '@/utils/ics';
import { secondaryButtonStyle } from '@/styles/buttonStyles';
import { Conference } from '@/types/conference';

interface ConferenceModalProps {
  conference: Conference;
  onClose: () => void;
}

export default function ConferenceModal({ conference, onClose }: ConferenceModalProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(true);
  const deadlines = getDeadlineInfo(conference);

  const handleExport = () => {
    exportConference(conference);
  };

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
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="modal"
        p="4"
        onClick={handleBackdropClick}
      >
        <Box
          bg="white"
          borderRadius="xl"
          maxW="800px"
          w="full"
          maxH="90vh"
          overflowY="auto"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          position="relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box
            position="sticky"
            top="0"
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            p="6"
            zIndex="10"
            borderTopRadius="xl"
          >
            <Button
              position="absolute"
              top="4"
              right="4"
              variant="ghost"
              size="sm"
              color="gray.600"
              transition="all 0.2s ease-in-out"
              _hover={{ bg: 'gray.100', color: 'gray.800' }}
              _active={{ transform: 'scale(0.95)' }}
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </Button>
            <VStack align="start" gap="2" pr="12">
              <Heading as="h2" size="xl" color="gray.800">
                {conference.title} {conference.year}
              </Heading>
              <Text fontSize="md" color="gray.600">
                {conference.full_name}
              </Text>
            </VStack>
          </Box>

          {/* Body */}
          <Box p="6">
          <VStack align="stretch" gap="6">
            {/* Conference Details */}
            <Box>
              <Heading as="h3" size="md" mb="4">
                Conference Details
              </Heading>
              <ConferenceDetails conference={conference} variant="modal" />
            </Box>

            {/* Deadlines */}
            {deadlines.length > 0 && (
              <Box>
                <Heading as="h3" size="md" mb="4">
                  Deadlines
                </Heading>
                <VStack align="stretch" gap="4">
                  {deadlines.map((deadline, idx) => (
                    <DeadlineCard
                      key={idx}
                      deadline={deadline}
                      timezone={conference.timezone}
                      variant="detailed"
                    />
                  ))}
                </VStack>
              </Box>
            )}

            {/* Quick Links */}
            <Box>
              <Heading as="h3" size="md" mb="4" color="gray.800">
                Quick Links
              </Heading>
              <Flex gap="3" wrap="wrap">
                {conference.link && (
                  <ExternalLinkButton href={conference.link} variant="primary" size="md" px="6">
                    <Flex align="center" gap="2">
                      <Globe size={16} />
                      <span>Event Website</span>
                    </Flex>
                  </ExternalLinkButton>
                )}
                {conference.paperslink && (
                  <ExternalLinkButton href={conference.paperslink} variant="secondary" size="md" px="6">
                    <Flex align="center" gap="2">
                      <FileText size={16} />
                      <span>Paper Submission</span>
                    </Flex>
                  </ExternalLinkButton>
                )}
                {conference.pwclink && (
                  <ExternalLinkButton href={conference.pwclink} variant="secondary" size="md" px="6">
                    <Flex align="center" gap="2">
                      <Code size={16} />
                      <span>Papers with Code</span>
                    </Flex>
                  </ExternalLinkButton>
                )}
                <Button
                  onClick={handleExport}
                  size="md"
                  px="6"
                  {...secondaryButtonStyle}
                >
                  <Flex align="center" gap="2">
                    <Calendar size={16} />
                    <span>Export to Calendar</span>
                  </Flex>
                </Button>
              </Flex>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
    </Portal>
  );
}

import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import DeadlineCard from './DeadlineCard';
import ExternalLinkButton from './ExternalLinkButton';
import SubjectBadgeGroup from './SubjectBadgeGroup';
import NoteBadge from './NoteBadge';
import ConferenceDetails from './ConferenceDetails';
import { getDeadlineInfo } from '@/utils/parser';
import { Conference } from '@/types/conference';

const MotionBox = motion.create(Box);

interface ConferenceCardProps {
  conference: Conference;
  onClick: () => void;
  index?: number;
}

export default function ConferenceCard({ conference, onClick, index = 0 }: ConferenceCardProps): JSX.Element {
  const allDeadlines = getDeadlineInfo(conference);

  // Lighter animation for mobile (faster, less "aggressive")
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const animationDelay = isMobile ? (index % 12) * 0.03 : (index % 12) * 0.02;
  const animationDuration = isMobile ? 0.3 : 0.25;

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
      cursor="pointer"
      whileHover={{
        boxShadow: '0 8px 24px rgba(46, 95, 169, 0.2)',
        y: -4,
        scale: 1.02,
        borderColor: 'var(--chakra-colors-brand-400)',
        transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
    >
      {/* Card Header */}
      <VStack align="stretch" gap="3" mb="3">
        <Flex justify="space-between" align="start" gap="3" wrap="wrap">
          <Heading as="h3" size="lg" color="gray.800" flex="1" minW="200px">
            {conference.title} {conference.year}
          </Heading>
          <SubjectBadgeGroup
            subjects={conference.sub}
            justify="flex-end"
            align="center"
          />
        </Flex>
        {conference.note && (
          <NoteBadge note={conference.note} />
        )}
      </VStack>

      {/* Subtitle */}
      <Text fontSize="sm" color="gray.600" mb="4" lineHeight="1.5">
        {conference.full_name}
      </Text>

      {/* Info Section */}
      <Box mb="4">
        <ConferenceDetails conference={conference} />
      </Box>

      {/* Deadlines */}
      {allDeadlines.length > 0 ? (
        <VStack
          align="stretch"
          gap="4"
          p="4"
          bg="gray.50"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          mb="4"
        >
          {allDeadlines.map((deadline, idx) => (
            <DeadlineCard
              key={idx}
              deadline={deadline}
              timezone={conference.timezone}
              variant="compact"
            />
          ))}
        </VStack>
      ) : (
        <Box
          p="3"
          textAlign="center"
          bg="gray.50"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          borderStyle="dashed"
          mb="4"
        >
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            No deadlines available
          </Text>
        </Box>
      )}

      {/* Links */}
      <Flex gap="3" wrap="wrap" pt="4" borderTop="1px" borderColor="gray.200">
        {conference.link && (
          <ExternalLinkButton
            href={conference.link}
            variant="primary"
            onClick={(e) => e.stopPropagation()}
          >
            Website
          </ExternalLinkButton>
        )}
        {conference.paperslink && (
          <ExternalLinkButton
            href={conference.paperslink}
            variant="primary"
            onClick={(e) => e.stopPropagation()}
          >
            Papers
          </ExternalLinkButton>
        )}
        {conference.pwclink && (
          <ExternalLinkButton
            href={conference.pwclink}
            variant="primary"
            onClick={(e) => e.stopPropagation()}
          >
            Papers w/ Code
          </ExternalLinkButton>
        )}
      </Flex>
    </MotionBox>
  );
}

/**
 * DeadlineCard Component
 *
 * Displays conference deadline information with countdown timer.
 * Supports two variants: compact (for cards) and detailed (for modals).
 * Shows both original timezone and local timezone, plus countdown or expired state.
 */

import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Countdown from './Countdown';
import type { DeadlineInfo } from '@/types/conference';

interface DeadlineCardProps {
  deadline: DeadlineInfo;
  timezone: string;
  variant?: 'compact' | 'detailed';
}

export default function DeadlineCard({
  deadline,
  timezone,
  variant = 'compact'
}: DeadlineCardProps): JSX.Element {
  const now = DateTime.now();
  const isExpired = deadline.localDatetime <= now;

  if (variant === 'detailed') {
    return (
      <Box
        bg="gray.50"
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box
          p="3"
          bg="blue.50"
          borderBottom="1px"
          borderColor="blue.200"
        >
          <Text
            fontSize="sm"
            fontWeight="600"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {deadline.label}
          </Text>
        </Box>
        <VStack align="stretch" gap="4" p="4">
          <VStack align="start" gap="1">
            <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
              Original Time:
            </Text>
            <Text fontSize="sm" color="gray.800" fontFamily="mono" lineHeight="1.6">
              {deadline.datetime.toFormat('EEEE, MMMM dd, yyyy')}
              <br />
              {deadline.datetime.toFormat('HH:mm')} {timezone}
            </Text>
          </VStack>
          <VStack align="start" gap="1">
            <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
              Your Local Time:
            </Text>
            <Text fontSize="sm" color="gray.800" fontFamily="mono" lineHeight="1.6">
              {deadline.localDatetime.toFormat('EEEE, MMMM dd, yyyy')}
              <br />
              {deadline.localDatetime.toFormat('HH:mm')} {deadline.localDatetime.zoneName}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap="3">
      <VStack align="stretch" gap="1">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="brand.500"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {deadline.label}
        </Text>
        <Flex fontSize="sm" gap="2">
          <Text color="gray.600" fontWeight="500" minW="60px">
            Original:
          </Text>
          <Text color="gray.800" fontFamily="mono" fontSize="xs">
            {deadline.datetime.toFormat('MMM dd, yyyy HH:mm')} {timezone}
          </Text>
        </Flex>
        <Flex fontSize="sm" gap="2">
          <Text color="gray.600" fontWeight="500" minW="60px">
            Local:
          </Text>
          <Text color="gray.800" fontFamily="mono" fontSize="xs">
            {deadline.localDatetime.toFormat('MMM dd, yyyy HH:mm')} {deadline.localDatetime.zoneName}
          </Text>
        </Flex>
      </VStack>

      <Box
        p="3"
        bg={isExpired ? 'red.50' : 'blue.50'}
        borderRadius="md"
        border="1px"
        borderColor={isExpired ? 'red.200' : 'blue.200'}
      >
        {isExpired ? (
          <Text fontSize="sm" color="red.600" fontWeight="600">
            Expired
          </Text>
        ) : (
          <Countdown deadline={deadline.localDatetime} label="Time remaining" />
        )}
      </Box>
    </VStack>
  );
}

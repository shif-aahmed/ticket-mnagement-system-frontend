'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArticleFeedbackType } from '@/types/knowledge-base';
import { Button } from '@/components/ui/button';
import { ThumbsUpIcon, ThumbsDownIcon, CheckCircleIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface ArticleFeedbackProps {
  articleId: string;
  className?: string;
}

export const ArticleFeedback = ({ articleId, className = '' }: ArticleFeedbackProps) => {
  const [feedback, setFeedback] = useState<ArticleFeedbackType>(null);

  const handleVote = (type: 'helpful' | 'not_helpful') => {
    setFeedback(type);
  };

  return (
    <div
      data-article-id={articleId}
      className={cn(
        'p-5 bg-[#F8FAF9] border border-[#E5EDE9] rounded-xl text-center space-y-3 transition-all',
        className
      )}
    >
      {feedback === null ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#102A2A]">
            Was this article helpful?
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ThumbsUpIcon size={15} className="text-[#059669]" />}
              onClick={() => handleVote('helpful')}
              className="hover:border-[#059669] hover:text-[#059669]"
            >
              Yes, it helped
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ThumbsDownIcon size={15} className="text-[#DC2626]" />}
              onClick={() => handleVote('not_helpful')}
              className="hover:border-[#DC2626] hover:text-[#DC2626]"
            >
              No, I need more help
            </Button>
          </div>
        </div>
      ) : feedback === 'helpful' ? (
        <div className="flex flex-col items-center justify-center py-2 space-y-1.5 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#059669]">
            <CheckCircleIcon size={18} />
            <span>Thank you for your feedback!</span>
          </div>
          <p className="text-xs text-[#6B7F7F] max-w-md">
            We are glad this guide resolved your issue. Your feedback helps our documentation team continuously improve internal knowledge.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 space-y-2 animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#D97706]">
            <span>Thank you for letting us know!</span>
          </div>
          <p className="text-xs text-[#6B7F7F] max-w-md">
            We apologize that this guide didn&apos;t fully solve your issue. You can create a ticket and our support team will handle it personally.
          </p>
          <div className="pt-1">
            <Link href="/tickets/create">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowUpRightIcon size={14} />}
              >
                Create a Ticket
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  XIcon,
} from '@/components/ui/icons';
import { TicketPriority } from '@/types/ticket';
import { CalendarDayCell } from '@/types/calendar';
import { getMonthYearTitle } from '@/lib/calendar-utils';

export interface CalendarMonthViewProps {
  currentYear: number;
  currentMonth: number; // 0-11
  matrix: CalendarDayCell[][];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const priorityStyles: Record<
  TicketPriority,
  { bg: string; text: string; border: string; dot: string }
> = {
  critical: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#991B1B]',
    border: 'border-[#FCA5A5]',
    dot: 'bg-[#DC2626]',
  },
  high: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#92400E]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#D97706]',
  },
  medium: {
    bg: 'bg-[#F0FDFA]',
    text: 'text-[#115E59]',
    border: 'border-[#99F6E4]',
    dot: 'bg-[#0D9488]',
  },
  low: {
    bg: 'bg-[#F8FAFC]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
};

export const CalendarMonthView = ({
  currentYear,
  currentMonth,
  matrix,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarMonthViewProps) => {
  const [selectedDayCell, setSelectedDayCell] = useState<CalendarDayCell | null>(null);

  // Close day details modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDayCell) {
        setSelectedDayCell(null);
      }
    };
    if (selectedDayCell) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDayCell]);

  // Count tickets in this month
  const monthTicketsCount = matrix.reduce((acc, week) => {
    return (
      acc +
      week.reduce((weekAcc, cell) => {
        return weekAcc + (cell.isCurrentMonth ? cell.tickets.length : 0);
      }, 0)
    );
  }, 0);

  return (
    <Card className="border-[#E5EDE9] bg-white overflow-hidden text-left shadow-sm">
      {/* Month Navigation & Controls Header */}
      <CardHeader className="p-4 sm:p-5 border-b border-[#E5EDE9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FCFDFD]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DDF4E9] text-[#064747] flex items-center justify-center shrink-0">
            <CalendarIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg sm:text-xl font-bold text-[#102A2A]">
                {getMonthYearTitle(currentYear, currentMonth)}
              </CardTitle>
              <Badge variant="active" size="sm">
                {monthTicketsCount} due
              </Badge>
            </div>
            <p className="text-xs text-[#6B7F7F] mt-0.5">
              Visualizing scheduled deliverables across organizational departments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="text-xs font-semibold h-8 border-[#CBD5E1] text-[#102A2A] hover:border-[#064747]"
          >
            Today
          </Button>

          <div className="inline-flex items-center rounded-lg border border-[#CBD5E1] bg-white p-0.5">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded text-[#4A5D5D] hover:text-[#102A2A] hover:bg-[#F3F9F7] transition-colors"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <div className="w-[1px] h-4 bg-[#E2E8F0]" />
            <button
              type="button"
              onClick={onNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded text-[#4A5D5D] hover:text-[#102A2A] hover:bg-[#F3F9F7] transition-colors"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[580px] md:min-w-full">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-[#E5EDE9] bg-[#F8FAFB] text-center text-xs font-bold text-[#4A5D5D] uppercase tracking-wider py-2.5">
            {WEEKDAY_NAMES.map((day) => (
              <div key={day} className="truncate px-1">
                {day}
              </div>
            ))}
          </div>

          {/* 7-Column Calendar Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E5EDE9] border-b border-[#E5EDE9]">
          {matrix.flat().map((cell, idx) => {
            const maxVisible = 2;
            const visibleTickets = cell.tickets.slice(0, maxVisible);
            const overflowCount = cell.tickets.length - maxVisible;

            return (
              <div
                key={cell.dateKey + idx}
                className={`min-h-[110px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col transition-colors ${
                  cell.isCurrentMonth
                    ? 'bg-white hover:bg-[#FBFDFD]'
                    : 'bg-[#FAFCFB] text-[#94A3B8]'
                } ${cell.isToday ? 'bg-[#F2FAF6]' : ''}`}
              >
                {/* Date Number and Today Indicator */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold rounded-full w-6 h-6 transition-all ${
                      cell.isToday
                        ? 'bg-[#064747] text-white font-bold shadow-sm'
                        : cell.isCurrentMonth
                        ? 'text-[#102A2A]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.isToday && (
                    <span className="hidden sm:inline-block text-[10px] font-bold text-[#064747] bg-[#DDF4E9] px-1.5 py-0.2 rounded">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Ticket Chips */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {visibleTickets.map((ticket) => {
                    const style = priorityStyles[ticket.priority] || priorityStyles.medium;
                    return (
                      <Link
                        key={ticket.id}
                        href={`/tickets/${ticket.id}`}
                        title={`${ticket.id}: ${ticket.subject} (${ticket.priority.toUpperCase()} • ${ticket.status})`}
                        className={`group flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[11px] border leading-tight transition-all hover:scale-[1.01] hover:shadow-xs ${style.bg} ${style.border} ${style.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}
                        />
                        <span className="font-bold shrink-0">{ticket.id}</span>
                        <span className="truncate opacity-90 group-hover:opacity-100">
                          {ticket.subject}
                        </span>
                      </Link>
                    );
                  })}

                  {/* Overflow Chip */}
                  {overflowCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedDayCell(cell)}
                      className="text-[11px] font-semibold text-[#064747] bg-[#DDF4E9]/60 hover:bg-[#DDF4E9] py-0.5 px-1.5 rounded text-left transition-colors flex items-center justify-between"
                    >
                      <span>+{overflowCount} more</span>
                      <span className="text-[10px] underline">view</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </CardContent>

      {/* Day Details Modal for multiple tickets */}
      {selectedDayCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Deliverables on ${selectedDayCell.dateKey}`}
            className="bg-white rounded-2xl max-w-lg w-full border border-[#E5EDE9] shadow-2xl overflow-hidden animate-in zoom-in-95"
          >
            <div className="p-4 border-b border-[#E5EDE9] flex items-center justify-between bg-[#F8FAFB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#DDF4E9] text-[#064747] flex items-center justify-center font-bold text-xs">
                  {selectedDayCell.dayNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A2A]">
                    Deliverables on {selectedDayCell.dateKey}
                  </h3>
                  <p className="text-xs text-[#6B7F7F]">
                    {selectedDayCell.tickets.length} tickets scheduled
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDayCell(null)}
                className="h-8 w-8 p-0 text-[#6B7F7F] hover:text-[#102A2A]"
              >
                <XIcon size={16} />
              </Button>
            </div>

            <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {selectedDayCell.tickets.map((ticket) => {
                const style = priorityStyles[ticket.priority] || priorityStyles.medium;
                return (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    onClick={() => setSelectedDayCell(null)}
                    className="block p-3 rounded-xl border border-[#E5EDE9] hover:border-[#064747] hover:bg-[#F3F9F7] transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <span className="text-xs font-bold text-[#102A2A]">
                          {ticket.id}
                        </span>
                        <span className="text-xs text-[#6B7F7F]">
                          • {ticket.department || 'General'}
                        </span>
                      </div>
                      <Badge
                        variant={
                          ticket.priority === 'critical'
                            ? 'urgent'
                            : ticket.priority === 'high'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-[#102A2A] group-hover:text-[#064747] transition-colors line-clamp-2">
                      {ticket.subject}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F4] text-[11px] text-[#6B7F7F]">
                      <span>Assignee: {ticket.assignee.name}</span>
                      <span className="capitalize font-medium text-[#102A2A]">
                        Status: {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-3 border-t border-[#E5EDE9] bg-[#FCFDFD] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDayCell(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

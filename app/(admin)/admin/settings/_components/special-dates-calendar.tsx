'use client'

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addSpecialDate, getSpecialDates } from "../_actions"
import { ko } from "date-fns/locale"
import { format } from "date-fns"

export default function SpecialDatesCalendar({ onUpdate }: { onUpdate: () => void }) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [type, setType] = useState<'BLOCKED' | 'DISCOUNT'>('BLOCKED')
  const [discount, setDiscount] = useState<number>(0)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setDate(date)
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!date) return;

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      
      await addSpecialDate({
        date: formattedDate,
        type,
        discount: type === 'DISCOUNT' ? discount : null
      });
      alert('특별 날짜가 추가되었습니다');
      setIsDialogOpen(false);
      setDate(undefined);
      onUpdate();
    } catch (error) {
      console.error('Error submitting date:', error);
      alert('특별 날짜 추가에 실패했습니다');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow max-w-[400px]">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border"
        locale={ko}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>특별 날짜 설정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                variant={type === 'BLOCKED' ? 'default' : 'outline'}
                onClick={() => setType('BLOCKED')}
              >
                예약 불가
              </Button>
              <Button 
                variant={type === 'DISCOUNT' ? 'default' : 'outline'}
                onClick={() => setType('DISCOUNT')}
              >
                할인 설정
              </Button>
            </div>

            {type === 'DISCOUNT' && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="할인율"
                />
                <span>%</span>
              </div>
            )}

            <Button onClick={handleSubmit}>저장</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
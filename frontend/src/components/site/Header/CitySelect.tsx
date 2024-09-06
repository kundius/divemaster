import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import styles from './CitySelect.module.scss'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CitySelectForm } from './CitySelectForm'

export function CitySelect() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={styles.button}>
          <span className={styles.affix}>
            <span className={styles.label}>Кременчуг-Константиновское</span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Ваш город</DialogTitle>
        </DialogHeader>
        <CitySelectForm />
      </DialogContent>
    </Dialog>
  )
}

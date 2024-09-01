import css from './Agreement.module.scss'

export function Agreement() {
  return (
    <label className={css.label}>
      <input type="checkbox" name="agreement" value="1" className={css.checkbox} />
      <span className={css.text}>
        Даю согласие Divemaster на получение информации о специальных предложениях
      </span>
    </label>
  )
}

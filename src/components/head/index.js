import classNames from 'classnames'

const Head = ({ children, paddingBottom }) => {

  return (
    <div
      className={classNames({
        'pt-3  pe-2 justify-space-between align-items-center bg-yellow': true,
        'pb-2': !paddingBottom
      })}
    >
      {children}
    </div>
  )
}

export default Head

type PassSelectionModalProps = {
  isOpen: boolean
  passes: Array<{ name: string; price: string }>
  onClose: () => void
  onSelect: (pass: { name: string; price: string }) => void
}

function PassSelectionModal({
  isOpen,
  passes,
  onClose,
  onSelect,
}: PassSelectionModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pass-select-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="meta-label">Pass selection</p>
            <h3 id="pass-select-title">Choose your pass</h3>
          </div>
          <button className="button ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <div className="pass-select-grid">
            {passes.map((pass) => (
              <button
                key={pass.name}
                className="pass-select-card"
                type="button"
                onClick={() => onSelect(pass)}
              >
                <div>
                  <p className="meta-label">Pass</p>
                  <h3>{pass.name}</h3>
                </div>
                <span className="chip">{pass.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PassSelectionModal

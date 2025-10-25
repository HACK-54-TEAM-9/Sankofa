export default function MaskGroup() {
  const imgRectangle10 = 'https://via.placeholder.com/512x512.png?text=Sankofa+Logo';

  return (
    <div className="relative size-full flex items-center justify-center" data-name="Mask group">
      <img
        src={imgRectangle10}
        alt="Sankofa-Coin Logo"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
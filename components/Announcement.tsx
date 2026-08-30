export interface AnnouncementProps {
  /** Announcement text (merchant-editable) */
  text: string;
  /** Optional link wrapping the announcement text (merchant-editable) */
  link?: string;
  /** Section background color (merchant-editable) */
  bgColor: string;
  /** Text color (merchant-editable) */
  textColor: string;
}

export default function Announcement({
  text,
  link,
  bgColor,
  textColor,
}: AnnouncementProps) {
  const content = <p className="text-xs md:text-sm">{text}</p>;

  return (
    <div
      id="AnnouncementBar"
      className="py-4 lg:py-2.5"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center text-center">
          {link ? (
            <a href={link} className="hover:opacity-80 transition-opacity">
              {content}
            </a>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}

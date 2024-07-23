import Link from 'next/link';
import { LinkIt, LinkItUrl } from 'react-linkify-it';
import { UserLinkWithTooltip } from './user-link-with-tooltip';

type Props = { children: React.ReactNode };

export const Linkify = ({ children }: Props) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
};

const LinkifyUrl = ({ children }: Props) => {
  return (
    <LinkItUrl className="text-sky-500 hover:underline">{children}</LinkItUrl>
  );
};

const LinkifyUsername = ({ children }: Props) => {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
};

const LinkifyHashtag = ({ children }: Props) => {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-sky-500 hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
};

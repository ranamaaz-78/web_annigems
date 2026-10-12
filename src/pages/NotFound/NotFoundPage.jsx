import EmptyState from '../../components/common/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="page-wrap">
      <EmptyState icon="◈" title="Page not found" text="The page you are looking for does not exist." actionLabel="Return Home" actionTo="/" />
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex items-center">
      <img
        src="/images/logo.jpg"
        alt="ロゴ"
        width={32}
        height={32}
        className="mr-2"
      />
      <span className="text-xl font-bold text-gray-900">Try GraphQL</span>
    </div>
  )
}

export { Logo }

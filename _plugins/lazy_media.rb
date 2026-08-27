# frozen_string_literal: true

Jekyll::Hooks.register %i[pages documents], :post_render do |document|
  next unless document.output_ext == ".html"

  document.output.gsub!(/<img\b(?![^>]*\bloading=)/i, '<img loading="lazy"')
  document.output.gsub!(/<img\b(?![^>]*\bdecoding=)/i, '<img decoding="async"')
  document.output.gsub!(/<iframe\b(?![^>]*\bloading=)/i, '<iframe loading="lazy"')
end

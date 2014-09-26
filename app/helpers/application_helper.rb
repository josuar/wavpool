module ApplicationHelper
  def s3_url(url)
    URI.join(S3_BUCKET.url, URI.encode(url))
  end
end

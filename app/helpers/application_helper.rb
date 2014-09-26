module ApplicationHelper
  def s3_url(url)
    URI.join(S3_BUCKET.url, url)
  end
end

create table if not exists articles
(
	article_id varchar(50) not null,
	title varchar(50) null,
	body varchar(8000) null,
	author_id varchar(50) null,
	constraint articles_articleid_uindex
		unique (article_id)
)
comment 'contains all the articles data';

create fulltext index fulltext_search
	on articles (title, body);

create table if not exists authors
(
	author_id varchar(50) not null,
	name varchar(50) null,
	job_title varchar(50) null,
	constraint authors_author_id_uindex
		unique (author_id)
)
comment 'the blog authors';

create table if not exists comment
(
	comment_id varchar(50) not null,
	article_id varchar(50) null,
	author_id varchar(50) null,
	body varchar(200) null,
	constraint comment_commentid_uindex
		unique (comment_id)
)
comment 'comments on certain article';

alter table comment
	add primary key (comment_id);

create table if not exists comments
(
	comment_id varchar(50) not null,
	article_id varchar(50) null,
	user_id varchar(50) null,
	body varchar(200) null,
	constraint comment_commentid_uindex
		unique (comment_id)
)
comment 'comments on certain article';

alter table comments
	add primary key (comment_id);

create table if not exists likes
(
	article_id varchar(50) null,
	user_id varchar(50) null
)
comment 'likes on article';
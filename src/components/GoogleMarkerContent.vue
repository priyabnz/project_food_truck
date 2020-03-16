<template>
    <div>
        {{title}}
        {{contentData}}
    </div>
</template>

<script>
module.exports = {
    props: [ 
        'contentData',
        'title'
    ],
}
</script>